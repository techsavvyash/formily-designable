// IMPORTS
import { INPUT_FIELD_TYPES } from './fieldTypes'
// UTILITY FUNCTIONS
// Function to extract the content within double curly braces
function extractInnerString(input) {
  // Define the regex pattern to match the content within double curly braces
  const regex = /\{\{(.*?)\}\}/s

  // Execute the regex on the input string and extract the match
  const match = regex.exec(input)

  // Return the captured group, or null if no match is found
  return match ? match[1] : null
}

// Get 'title' from the dependencis
function getTitleFromDependency(dependency, formilyJSON) {
  const titles = {}
  dependency.forEach((dep) => {
    const source = dep['source']
    // const title = formilyJSON[source]['title'].replace(/\s/g, '')
    const title = source.replace(/\s/g, '')
    const name = dep['name']
    titles[name] = title
  })
  return titles
}

// Replace $deps with formInput and variable parts with the desired format
function replaceDepsWithFormInput(input, titles) {
  // Replace $deps with formInput
  let result = input.replace(/\$deps/g, 'formInput')

  // Define the regex pattern to match the variable parts
  const variablePattern = /\.(v_[a-z0-9]+)/g

  // Replace each matched variable part with the desired format
  result = result.replace(variablePattern, (match, p1) => {
    return `["${titles[p1]}"]`
  })

  return result
}

class FieldParsers {
  constructor(formilyJSON_) {
    this.formilyJSON = formilyJSON_
  }

  // DISPLAY PARSER:
  // Parses the 'x-display' field in the JSON schema
  displayParser(fieldDetail) {
    if (!fieldDetail['x-display']) return true
    const display = fieldDetail['x-display']
    if (display === 'visible' || display === 'inherit' || display === '')
      return true
    else return false
  }

  // REACTIONS PARSER:
  // Parses the 'x-reactions' field in the JSON schema
  // Return Type: A boolean expreesion
  // that can be directly used in the 'isVisibleCode' field of Flowise
  reactionsParser(fieldDetail) {
    // "{{$deps.v_ef781vv5r3v == \"I1\"\r\n&&\r\n$deps.v_9bdqtfzwmd7 == \"Class 1\"}}"
    if (!fieldDetail['x-reactions']) return true
    if (fieldDetail['x-reactions'] == {}) return true
    if (fieldDetail['x-reactions']['fulfill'] == {}) return true
    if (fieldDetail['x-reactions']['fulfill']['state'] == {}) return true
    if (fieldDetail['x-reactions']['fulfill']['state']['visible'] == {})
      return true
    const dependencies = fieldDetail['x-reactions']['dependencies']
    const visibleCode = extractInnerString(
      fieldDetail['x-reactions']['fulfill']['state']['visible']
    )
    // "$deps.v_ef781vv5r3v == \"I1\"\r\n&&\r\n$deps.v_9bdqtfzwmd7 == \"Class 1\""
    const titles = getTitleFromDependency(dependencies, this.formilyJSON)
    if (!visibleCode) return true
    if (!titles) return true
    const reactions = replaceDepsWithFormInput(visibleCode, titles)
    return reactions
  }

  // VALIDATION PARSER:
  // Parses the 'x-validator' field in the JSON schema
  // Return Type: An array of validation functions
  validationParser(validations) {
    const validationArray = []
    if (typeof validations === 'string') {
      validationArray.push(validations)
      return validationArray
    }
    return validations.length != 0 ? validations : validationArray
  }

  // INPUT FIELD PARSER
  Input(fieldDetail) {
    let title
    if (fieldDetail['name']) {
      title = fieldDetail['name'].replace(/\s/g, '')
    } else {
      title = fieldDetail['x-designable-id']
    }
    // const title = fieldDetail['title'].replace(/\s/g, '') // mustn't have spaces
    const display = this.displayParser(fieldDetail)
    const reactions = this.reactionsParser(fieldDetail)
    return {
      title,
      component: 'Input',
      description: fieldDetail['description'] || 'Description not provided',
      validation: this.validationParser(fieldDetail['x-validator']),
      display,
      reactions,
      required: fieldDetail['required'] || false,
    }
  }

  // SELECT FIELD PARSER
  Select(fieldDetail) {
    let title
    if (fieldDetail['name']) {
      title = fieldDetail['name'].replace(/\s/g, '')
    } else {
      title = fieldDetail['x-designable-id']
    }
    // const title = fieldDetail['title'].replace(/\s/g, '')
    const display = this.displayParser(fieldDetail)
    const reactions = this.reactionsParser(fieldDetail)
    if (!fieldDetail['enum']) {
      return {
        title,
        component: 'Select',
        description: fieldDetail['description'] || 'Description not provided',
        validation: [],
        options: [],
        display,
        reactions,
        required: fieldDetail['required'] || false,
      }
    }
    return {
      title,
      component: 'Select',
      description: fieldDetail['description'] || 'Description not provided',
      validation: [],
      options: fieldDetail['enum'].map((option, index) => {
        return {
          key: option['value'],
          text: option['label'],
          isEnabled: true,
          showTextInput: true,
        }
      }),
      display,
      reactions,
      required: fieldDetail['required'] || false,
    }
  }

  // TEXTAREA FIELD PARSER
  TextArea(fieldDetail) {
    // TODO: Implement TextArea
  }

  // Formily Input Field Details Parser
  parseFormilyInputFieldDetails(fieldDetail) {
    const component = fieldDetail['x-component']
    // Switch case for each type of component
    let parsedObject

    switch (component) {
      case INPUT_FIELD_TYPES.INPUT:
        parsedObject = this.Input(fieldDetail)
        break
      case INPUT_FIELD_TYPES.SELECT:
        parsedObject = this.Select(fieldDetail)
        break
      case INPUT_FIELD_TYPES.TEXTAREA:
        // TODO: Implement TextArea
        break
      default:
        parsedObject = {
          title: 'Error',
          component: 'Error',
          description: 'Component not found',
          validation: [],
          display: false,
          required: false,
        }
    }
    return parsedObject
  }
}

// Formily JSON Parser
export const parseFormilyJSON = (properties) => {
  const fieldDetails = []
  const parser = new FieldParsers(properties)
  const fields = Object.keys(properties)
  fields.forEach((field) => {
    fieldDetails.push(parser.parseFormilyInputFieldDetails(properties[field]))
  })
  return fieldDetails
}

// module.exports = parseFormilyJSON
