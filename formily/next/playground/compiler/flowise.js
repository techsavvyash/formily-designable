// import * as fs from 'fs'
// import * as fs from 'browserify-fs'
// import * as path from 'path'
import { INPUT_FIELD_TYPES } from './fieldTypes'

import validations from './valid'
// import * as startNode from './startNode.json'

const startNode = {
  id: 'start',
  data: {
    id: 'start',
    name: 'start',
    type: 'Output',
    label: 'Start',
    inputs: {},
    outputs: {
      startPointer: '',
    },
    category: 'Miscellaneous',
    selected: false,
    baseClasses: ['xMessage'],
    description: 'Start pointer Points to node  ',
    inputParams: [],
    inputAnchors: [],
    outputAnchors: [
      {
        id: 'start-output-startPointer-xMessage',
        name: 'startPointer',
        type: 'xMessage',
        label: 'start Pointer',
      },
    ],
  },
  type: 'customNode',
  width: 300,
  height: 113,
  dragging: false,
  position: {
    x: 409.5560193025037,
    y: 25.92199759211908,
  },
  selected: false,
  positionAbsolute: {
    x: 409.5560193025037,
    y: 25.92199759211908,
  },
  style: {},
}

// TODO:
// XMessage: Function needs to be created
const msg_init = 'const msg = JSON.parse($0);\n'
const msg_end = 'return JSON.stringify(msg);'

// ASK QUESTION CODE
function AskQuestion(description) {
  return `msg.payload.text = "${description}";\n`
}

function GetInput(title, validation) {
  let validationCode = ''
  if (validation !== 'none') {
    // const validationPath = path.resolve(__dirname, 'validations.js')

    try {
      // let validationFile = null;
      // fs.readFile(validationPath, 'utf8', (err, data) => {
      //   if (err) {
      //     console.error('Error reading validation file:', err)
      //     throw err
      //   }
      //   validationFile = data;
      // })
      validationCode =
        validations +
        // validationFile +
        `if(!validator["${validation}"](msg.payload.text)) throw new Error('Wrong input, Please Retype');\n`
    } catch (err) {
      console.error('Error reading validation file:', err)
      throw err
    }
  }
  const s1 = `let formInput = msg.transformer.metaData.formInput;\n`
  const s2 = `if(formInput){\n`
  const s3 = `formInput = {...formInput, \"${title}\": msg.payload.text};\n`
  const s4 = `} else {\n`
  const s5 = `formInput = {\"${title}\": msg.payload.text};\n`
  const s6 = `}\n`
  const s7 = `msg.transformer.metaData.formInput = formInput;\n`

  return validationCode + s1 + s2 + s3 + s4 + s5 + s6 + s7
}

function Input(fieldDetail) {
  return AskQuestion(fieldDetail['description'])
}

function Select(fieldDetail) {
  const ask = AskQuestion(fieldDetail['description'])
  const buttonChoices = 'msg.payload.buttonChoices ='
  const optionsJSON = JSON.stringify({
    header: fieldDetail['description'],
    choices: fieldDetail['options'],
  })
  const options = `${optionsJSON};\n`
  return ask + buttonChoices + options
}

// class FlowiseCode {
// static msg_init = 'const msg = JSON.parse($0);\n'
// static msg_end = 'return JSON.stringify(msg);'
// // ASK QUESTION CODE
// static AskQuestion(description) {
//   return `msg.payload.text = "${description}";\n`
// }
// GET INPUT CODE
// static GetInput(title, validation) {
//   let validationCode = ''
//   if (validation !== 'none') {
//     const validationPath = path.resolve(__dirname, 'validations.js')
//     // console.log('Resolved validation file path:', validationPath)
//     // const cwd = process.cwd()
//     // console.log('Current working directory:', cwd)
//     try {
//       const validationFile = fs.readFileSync(validationPath, 'utf8')
//       validationCode =
//         validationFile +
//         `if(!validator["${validation}"](msg.payload.text)) throw new Error('Wrong input, Please Retype');\n`
//     } catch (err) {
//       console.error('Error reading validation file:', err)
//       throw err
//     }
//   }
//   const s1 = `let formInput = msg.transformer.metaData.formInput;\n`
//   const s2 = `if(formInput){\n`
//   const s3 = `formInput = {...formInput, \"${title}\": msg.payload.text};\n`
//   const s4 = `} else {\n`
//   const s5 = `formInput = {\"${title}\": msg.payload.text};\n`
//   const s6 = `}\n`
//   const s7 = `msg.transformer.metaData.formInput = formInput;\n`
//   return validationCode + s1 + s2 + s3 + s4 + s5 + s6 + s7
// }
// INPUT FIELD CODE
// static Input(fieldDetail) {
//   return this.AskQuestion(fieldDetail['description'])
// }
// SELECT FIELD CODE
// static Select(fieldDetail) {
//   const ask = this.AskQuestion(fieldDetail['description'])
//   const buttonChoices = 'msg.payload.buttonChoices ='
//   const optionsJSON = JSON.stringify({
//     header: fieldDetail['description'],
//     choices: fieldDetail['options'],
//   })
//   const options = `${optionsJSON};\n`
//   return ask + buttonChoices + options
// }
// TEXTAREA FIELD CODE
// static TextArea(fieldDetail) {}
// }

export class Flowise {
  constructor(parsedformilyFields) {
    this.fields = parsedformilyFields
    this.nodes = [startNode]
    this.edges = []
    this.createGraph()
  }

  toJSON() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      viewport: {
        x: -89.25227931693917,
        y: 282.4605317435965,
        zoom: 0.4464677076656672,
      },
      name: '',
    }
  }

  createGraph() {
    // this.nodes = [startNode]; // Start Node is already present

    // Get the fields array (parsed formily fields)
    const fields = this.fields

    // Create Code Runner and User Feedback Loop Nodes for each field
    fields.forEach((field, index) => {
      // Creating an unique id for each node
      const id = `FIELD_${index}`

      // Get Previous node for creating edge
      const prevNode =
        index == 0 ? startNode : this.nodes[this.nodes.length - 1]

      // Get previous field for creating Code Runner Node
      let prevField = null
      if (index != 0) {
        prevField = fields[index - 1]
      }

      // Creating the Code Runner Node
      const C_R_Node = this.codeRunnerNode(prevField, field, id, index)
      // Creating the User Feedback Loop Node
      const U_F_Node = this.userFeedbackLoopNode(id)

      // Pushing nodes into the nodes array
      this.nodes.push(C_R_Node)
      this.nodes.push(U_F_Node)

      // Creating edges
      const inEdge = this.createEdge(prevNode, C_R_Node)
      const outEdge = this.createEdge(C_R_Node, U_F_Node)

      // Pushing edges into the edges array
      this.edges.push(inEdge)
      this.edges.push(outEdge)
    })

    // Create Last Node

    // Get Previous node for creating edge (User Feedback Loop Node)
    const prevNode = this.nodes.slice(-1)[0]
    // Last field in the fields array
    const lastField = fields.slice(-1)[0]
    // Creating the Last Node
    const lastNode = this.codeRunnerNode(
      lastField,
      {
        title: 'Thank You!',
        description: 'Thank You!',
        component: 'END',
        validation: 'none',
      },
      `END_${fields.length}`,
      fields.length
    )

    // Pushing the last node into the nodes array
    this.nodes.push(lastNode)

    // Creating the edge for the last node
    const edge = this.createEdge(prevNode, lastNode)

    // Pushing the edge into the edges array
    this.edges.push(edge)

    // Adding Validation Code_Runner Nodes
    this.addValidationNodes()
  }

  // ADD VALIDATION NODES
  addValidationNodes() {
    // Get All Fields (as number of fields = number of User Feedback Loop Nodes = number of Code Runner Validation Nodes)
    const fields = this.fields

    // For each field
    fields.forEach((field, index) => {
      // Creating an unique id for each node
      const id = `VALIDATION_${index}`

      // Get Code Runner Node belonging to the next field
      const nextCRNodeIndex = (index + 1) * 2 + 1 // index = 0 => nextCRNodeIndex = 3 (bcoz 0th index is startNode)
      const nextCRNode = this.nodes[nextCRNodeIndex]

      // Get User Feedback Loop Node belonging to the current field
      const U_F_Node = this.nodes[nextCRNodeIndex - 1]

      // Creating the Code Runner Validation Node
      const inputXMessage = [`${nextCRNode['id']}.data.instance`]
      const C_R_VNode = this.codeRunnerValidationNode(id, field, inputXMessage)

      // Pushing nodes into the nodes array
      this.nodes.push(C_R_VNode)

      // Updating the User Feedback Loop Node input XMessage
      this.nodes[nextCRNodeIndex - 1]['data']['inputs']['xmessage'].push(
        `${C_R_VNode['id']}.data.instance`
      )

      // Creating edges
      const inEdge = this.createEdge(nextCRNode, C_R_VNode, true)
      const outEdge = this.createEdge(C_R_VNode, U_F_Node)

      // Pushing edges into the edges array
      this.edges.push(inEdge)
      this.edges.push(outEdge)
    })
  }

  // CODE RUNNER VALIDATION NODE Creator
  codeRunnerValidationNode(id, field, xMessage) {
    const node = {
      id: `CODE_RUNNER_${id}`,
      position: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      type: 'customNode',
      data: {
        id: `CODE_RUNNER_${id}`,
        label: 'Code Runner Transformer',
        name: 'CODE_RUNNER',
        type: 'Output',
        category: 'GenericTransformer',
        description: 'A code runner capable of running custom JS code.',
        baseClasses: ['xMessage'],
        inputs: {
          xmessage: xMessage,
          code: `const msg = JSON.parse($0);\nmsg.payload.text = \"Wrong input, Please input a ${field['validation']}\";\nreturn JSON.stringify(msg);`,
        },
        outputs: {
          onError: '',
          onSuccess: '',
        },
        selected: false,

        inputAnchors: [
          {
            id: `CODE_RUNNER_${id}-input-xmessage-xMessage`,
            list: true,
            name: 'xmessage',
            type: 'xMessage',
            label: 'XMessage',
          },
        ],
        inputParams: [
          {
            label: 'Code',
            name: 'code',
            type: 'ide',
            rows: 2,
            id: `CODE_RUNNER_${id}-input-code-ide`,
          },
          {
            id: `CODE_RUNNER_${id}-input-sideEffects-json`,
            label: 'SideEffects',
            name: 'sideEffects',
            rows: 2,
            type: 'json',
          },
        ],
        outputAnchors: [
          {
            id: `CODE_RUNNER_${id}-output-onSuccess-xMessage`,
            name: 'onSuccess',
            label: 'On Success',
            type: 'xMessage',
          },
          {
            id: `CODE_RUNNER_${id}-output-onError-xMessage`,
            name: 'onError',
            label: 'On Error',
            type: 'xMessage',
          },
        ],
      },
      width: 300,
      height: 569,
      selected: false,
      dragging: false,
      positionAbsolute: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      style: {},
    }
    return node
  }

  // CODE RUNNER NODE Creator
  codeRunnerNode(prevField, field, id, index) {
    const component = field['component']
    let code = msg_init

    // Take input from previous field and store it in formInputs (if index != 0)
    if (index != 0) {
      code += GetInput(prevField['title'], prevField['validation'])
    }
    // ASK NEXT QUESTION: set payload for the current field (description) handle different components differently
    switch (component) {
      case INPUT_FIELD_TYPES.INPUT:
        code += Input(field)
        break
      case INPUT_FIELD_TYPES.SELECT:
        code += Select(field)
        break
      case INPUT_FIELD_TYPES.TEXTAREA:
        // TODO: Implement TextArea
        break
      case 'END':
        code += AskQuestion('Thank You!')
        break
    }

    // If last field, then return the msg
    code += msg_end

    // Create xMessage: input from previous edge
    const xMessage = []
    if (index != 0) {
      xMessage.push(`USER_FEEDBACK_LOOP_FIELD_${index - 1}.data.instance`)
    } else {
      xMessage.push('start.data.instance')
    }

    const node = {
      id: `CODE_RUNNER_${id}`,
      data: {
        id: `CODE_RUNNER_${id}`,
        name: 'CODE_RUNNER',
        type: 'Output',
        label: 'Code Runner Transformer',
        inputs: {
          code: code,
          xmessage: xMessage,
        },
        outputs: {
          onError: '',
          onSuccess: '',
        },
        category: 'GenericTransformer',
        selected: false,
        baseClasses: ['xMessage'],
        description: 'A code runner capable of running custom JS code.',
        inputParams: [
          {
            id: `CODE_RUNNER_${id}-input-code-ide`,
            name: 'code',
            rows: 2,
            type: 'ide',
            label: 'Code',
          },
          {
            id: `CODE_RUNNER_${id}-input-sideEffects-json`,
            name: 'sideEffects',
            rows: 2,
            type: 'json',
            label: 'SideEffects',
          },
        ],
        inputAnchors: [
          {
            id: `CODE_RUNNER_${id}-input-xmessage-xMessage`,
            list: true,
            name: 'xmessage',
            type: 'xMessage',
            label: 'XMessage',
          },
        ],
        outputAnchors: [
          {
            id: `CODE_RUNNER_${id}-output-onSuccess-xMessage`,
            name: 'onSuccess',
            type: 'xMessage',
            label: 'On Success',
          },
          {
            id: `CODE_RUNNER_${id}-output-onError-xMessage`,
            name: 'onError',
            type: 'xMessage',
            label: 'On Error',
          },
        ],
      },
      type: 'customNode',
      width: 300,
      height: 569,
      dragging: false,
      position: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      selected: false,
      positionAbsolute: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      style: {},
    }
    return node
  }

  // USER FEEDBACK LOOP NODE Creator
  userFeedbackLoopNode(id) {
    const xMessage = []
    xMessage.push(`CODE_RUNNER_${id}.data.instance`)

    const node = {
      id: `USER_FEEDBACK_LOOP_${id}`,
      data: {
        id: `USER_FEEDBACK_LOOP_${id}`,
        name: 'USER_FEEDBACK_LOOP',
        type: 'Output',
        label: 'User Feedback Loop',
        inputs: {
          xmessage: xMessage,
        },
        outputs: {
          restoreState: '',
        },
        category: 'StateRestoreTransformer',
        selected: false,
        baseClasses: ['xMessage'],
        description:
          'A transformer which restores state to a specific node after sending a message to user.',
        inputParams: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-input-sideEffects-json`,
            name: 'sideEffects',
            rows: 2,
            type: 'json',
            label: 'SideEffects',
          },
        ],
        inputAnchors: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-input-xmessage-xMessage`,
            list: true,
            name: 'xmessage',
            type: 'xMessage',
            label: 'XMessage',
          },
        ],
        outputAnchors: [
          {
            id: `USER_FEEDBACK_LOOP_${id}-output-restoreState-xMessage`,
            name: 'restoreState',
            type: 'xMessage',
            label: 'Restore State',
          },
        ],
      },
      type: 'customNode',
      width: 300,
      height: 569,
      dragging: false,
      position: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      selected: false,
      positionAbsolute: {
        x: 3255.789032183661,
        y: -141.0959960862705,
      },
      style: {},
    }
    return node
  }

  // EDGE Creator
  createEdge(source, target, error = false) {
    let Source_OutId
    if (error && source['data']['outputAnchors'].length > 1) {
      Source_OutId = source['data']['outputAnchors'][1]['id']
    } else {
      // console.log('source: ', source)
      Source_OutId = source['data']['outputAnchors'][0]['id']
    }
    const Target_InId = target['data']['inputAnchors'][0]['id']

    const edgeId = `${source.id}-${target.id}`

    const edge = {
      id: edgeId,
      data: {
        label: '',
      },
      type: 'buttonedge',
      source: source.id,
      target: target.id,
      sourceHandle: Source_OutId,
      targetHandle: Target_InId,
    }
    return edge
  }
}

// module.exports = Flowise
