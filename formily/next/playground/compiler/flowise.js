// import * as fs from 'fs'
// import * as fs from 'browserify-fs'
// import * as path from 'path'
import { INPUT_FIELD_TYPES } from './fieldTypes'
import { startNode, endNode } from './start_end'
import validations from './valid'

// Default Code Text For Code Runner Nodes
const msg_init = 'const msg = JSON.parse($0);\n'
const msg_end = 'return JSON.stringify(msg);'

// IS VISIBLE CODE TEXT
function isVisibleCode(fieldDetail) {
  let code = msg_init
  // If field is not visible, throw an error to go to next group
  if (fieldDetail['display'] === false) {
    code += `throw new Error('Not Visible');\n`
  }
  // If field is visible, check for reactions
  if (fieldDetail['reactions']) {
    code += `let formInput = msg.transformer.metaData.formInput;\n`
    // If reactions are not fulfilled, throw an error to go to next group
    code += `if(!(${fieldDetail['reactions']})) throw new Error('Not Visible');\n`
  }
  code += msg_end
  return code
}

// ASK QUESTION CODE TEXT
function AskQuestion(fieldDetail) {
  const description = fieldDetail['description'] || 'Description not provided'
  const component = fieldDetail['component']
  let code = msg_init
  code += `msg.payload.text = "${description}";\n`
  switch (component) {
    case INPUT_FIELD_TYPES.INPUT:
      break
    case INPUT_FIELD_TYPES.SELECT:
      code += Select(fieldDetail)
      break
    case INPUT_FIELD_TYPES.TEXTAREA:
      break
    default:
      break
  }
  code += msg_end
  return code
}

// Store INPUT in formInput and Validate it
function GetInput(title, validation) {
  // Validation Code Text
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

  // Store Input in formInput
  const s1 = `let formInput = msg.transformer.metaData.formInput;\n`
  const s2 = `if(formInput){\n`
  const s3 = `formInput = {...formInput, \"${title}\": msg.payload.text};\n`
  const s4 = `} else {\n`
  const s5 = `formInput = {\"${title}\": msg.payload.text};\n`
  const s6 = `}\n`
  const s7 = `msg.transformer.metaData.formInput = formInput;\n`

  const storeInput = s1 + s2 + s3 + s4 + s5 + s6 + s7

  return msg_init + validationCode + storeInput + msg_end
}

// Validation msg Code Text
function ValidationMsg(validation) {
  const code = `const msg = JSON.parse($0);\nmsg.payload.text = \"Wrong input, Please input a ${validation}\";\nreturn JSON.stringify(msg);`
  return code
}

// HANDLING code text for Different FIELD TYPES
// HANDLE code text for SELECT FIELD
function Select(fieldDetail) {
  const buttonChoices = 'msg.payload.buttonChoices ='
  const optionsJSON = JSON.stringify({
    header: fieldDetail['description'],
    choices: fieldDetail['options'],
  })
  const options = `${optionsJSON};\n`
  return buttonChoices + options
}

// FLOWISE CLASS: Manages the flowise Graph
export class Flowise {
  constructor(parsedformilyFields) {
    this.fields = parsedformilyFields
    this.edges = []
    this.nodes = {
      start: startNode,
      end: endNode,
    }
    this.createGraph()
  }

  // TO JSON FUNCTION:
  // Returns the required Flowise JSON
  toJSON() {
    return {
      nodes: Object.values(this.nodes),
      edges: this.edges,
      viewport: {
        x: -89.25227931693917,
        y: 282.4605317435965,
        zoom: 0.4464677076656672,
      },
      name: '',
    }
  }

  // CREATE GRAPH FUNCTION :
  // Creates the graph according to the fields
  createGraph() {
    // Store fields in a variable;
    const fields = this.fields

    // Foreach field, create the group of nodes and edges
    fields.forEach((field, index) => {
      // create Field Group
      this.createFieldGroup(field, index)
    })

    // Create The External Edges for each group
    // Connect each group to the next group
    const numberOfFields = fields.length
    for (let index = 0; index < numberOfFields; index++) {
      // Edge: prev-CODE_RUNNER_STORE_NODE / START (if index == 0) -> curr-CODE_RUNNER_isVISIBLE_NODE
      if (index == 0) {
        // Edge: START -> curr-CODE_RUNNER_isVISIBLE_NODE
        const start_isVisible_edge = this.createEdge(
          this.nodes['start'],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`]
        )
        this.edges.push(start_isVisible_edge)
        // Update xMessage of curr-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(`start`, `CODE_RUNNER_isVISIBLE_${index}`)
      } else {
        // Edge: prev-CODE_RUNNER_STORE_NODE -> curr-CODE_RUNNER_isVISIBLE_NODE
        const prev_isVisible_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_STORE_${index - 1}`],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`]
        )
        this.edges.push(prev_isVisible_edge)
        // Update xMessage of curr-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(
          `CODE_RUNNER_STORE_${index - 1}`,
          `CODE_RUNNER_isVISIBLE_${index}`
        )
      }

      // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> next-CODE_RUNNER_isVISIBLE_NODE / END (if index == fields.length - 1)
      if (index == fields.length - 1) {
        // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> END
        const isVisible_end_error_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`],
          this.nodes['end'],
          true
        )
        this.edges.push(isVisible_end_error_edge)
        // Update xMessage of END
        this.xMessageConnect(`CODE_RUNNER_isVISIBLE_${index}`, `end`)
      } else {
        // ERROR-Edge: curr-CODE_RUNNER_isVISIBLE_NODE -> next-CODE_RUNNER_isVISIBLE_NODE
        const isVisible_next_error_edge = this.createEdge(
          this.nodes[`CODE_RUNNER_isVISIBLE_${index}`],
          this.nodes[`CODE_RUNNER_isVISIBLE_${index + 1}`],
          true
        )
        this.edges.push(isVisible_next_error_edge)
        // Update xMessage of next-CODE_RUNNER_isVISIBLE_NODE
        this.xMessageConnect(
          `CODE_RUNNER_isVISIBLE_${index}`,
          `CODE_RUNNER_isVISIBLE_${index + 1}`
        )
      }
    }

    // Connect the last group to the END node
    // Edge: last-CODE_RUNNER_STORE_NODE -> END
    const last_Store_end_edge = this.createEdge(
      this.nodes[`CODE_RUNNER_STORE_${numberOfFields - 1}`],
      this.nodes['end']
    )
    // Update xMessage of END node
    this.xMessageConnect(`CODE_RUNNER_STORE_${numberOfFields - 1}`, `end`)
    // push last_Store_end_edge
    this.edges.push(last_Store_end_edge)
  }

  // CREATE FIELD GROUP
  // Creates a group of nodes and edges for a field according to diagram
  // @PARAMS:
  // field: field object
  // index: index of the field
  createFieldGroup(field, index) {
    // create CODE_RUNNER_isVISIBLE_NODE
    const isVisibleNode_id = `isVISIBLE_${index}`
    const isVisibleNode_Code = isVisibleCode(field)
    const isVisibleNode = this.codeRunnerNode(
      isVisibleNode_id,
      isVisibleNode_Code,
      []
    )

    // create CODE_RUNNER_ASK_NODE
    const askNode_id = `ASK_${index}`
    const askNode_Code = AskQuestion(field)
    const askNode_xm = []
    askNode_xm.push(`${isVisibleNode['id']}.data.instance`)
    const askNode = this.codeRunnerNode(askNode_id, askNode_Code, askNode_xm)

    // Edge between CODE_RUNNER_isVISIBLE_NODE -> CODE_RUNNER_ASK_NODE
    const isVisible_Ask_edge = this.createEdge(isVisibleNode, askNode)

    // create USER_FEEDBACK_LOOP_NODE
    const userFeedbackLoopNode_xm = []
    userFeedbackLoopNode_xm.push(`${askNode['id']}.data.instance`)
    const userFeedbackLoopNode = this.userFeedbackLoopNode(
      index,
      userFeedbackLoopNode_xm
    )

    // Edge between CODE_RUNNER_ASK_NODE -> USER_FEEDBACK_LOOP_NODE
    const ask_UserFeedback_edge = this.createEdge(askNode, userFeedbackLoopNode)

    // create CODE_RUNNER_STORE_NODE
    const storeNode_id = `STORE_${index}`
    const storeNode_Code = GetInput(field['title'], field['validation'])
    const storeNode_xm = []
    storeNode_xm.push(`${userFeedbackLoopNode['id']}.data.instance`)
    const storeNode = this.codeRunnerNode(
      storeNode_id,
      storeNode_Code,
      storeNode_xm
    )

    // Edge between USER_FEEDBACK_LOOP_NODE -> CODE_RUNNER_STORE_NODE
    const userFeedback_Store_edge = this.createEdge(
      userFeedbackLoopNode,
      storeNode
    )

    // create CODE_RUNNER_VALIDATION_NODE
    const validationNode_id = `VALIDATION_${index}`
    const validationNode_Code = ValidationMsg(field['validation'])
    const validationNode_xm = []
    validationNode_xm.push(`${storeNode['id']}.data.instance`)
    const validationNode = this.codeRunnerNode(
      validationNode_id,
      validationNode_Code,
      validationNode_xm
    )

    // ERROR-Edge between CODE_RUNNER_STORE_NODE -> CODE_RUNNER_VALIDATION_NODE
    const store_Validation_error_edge = this.createEdge(
      storeNode,
      validationNode,
      true
    )

    // Edge between CODE_RUNNER_VALIDATION_NODE -> USER_FEEDBACK_LOOP_NODE
    const validation_UserFeedback_edge = this.createEdge(
      validationNode,
      userFeedbackLoopNode
    )

    // Push validationNodeId to userFeedbackLoopNode's xMessage
    userFeedbackLoopNode['data']['inputs']['xmessage'].push(
      `${validationNode['id']}.data.instance`
    )

    // Push all nodes and edges to this.nodes and this.edges sequentially
    // push `isVisibleNode`
    this.nodes[isVisibleNode['id']] = isVisibleNode
    // push `askNode`
    this.nodes[askNode['id']] = askNode
    // push `edge isVisible_Ask_edge`
    this.edges.push(isVisible_Ask_edge)
    // push `userFeedbackLoopNode`
    this.nodes[userFeedbackLoopNode['id']] = userFeedbackLoopNode
    // push `edge ask_UserFeedback_edge`
    this.edges.push(ask_UserFeedback_edge)
    // push `storeNode`
    this.nodes[storeNode['id']] = storeNode
    // push `edge userFeedback_Store_edge`
    this.edges.push(userFeedback_Store_edge)
    // push `validationNode`
    this.nodes[validationNode['id']] = validationNode
    // push `edge store_Validation_error_edge`
    this.edges.push(store_Validation_error_edge)
    // push `edge validation_UserFeedback_edge`
    this.edges.push(validation_UserFeedback_edge)
  }

  // CODE RUNNER NODE Creator
  // @PARAMS:
  // id: id of the node
  // code: for data.inputs.code
  // xMessage: for data.inputs.xmessage
  codeRunnerNode(id, code, xMessage) {
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
  // Creates a user feedback loop node
  // @PARAMS:
  // id: id of the node
  // xMessage: for data.inputs.xmessage (optional)
  userFeedbackLoopNode(id, xMessage) {
    const node = {
      id: `USER_FEEDBACK_LOOP_${id}`,
      data: {
        id: `USER_FEEDBACK_LOOP_${id}`,
        name: 'USER_FEEDBACK_LOOP',
        type: 'Output',
        label: 'User Feedback Loop',
        inputs: {
          xmessage: xMessage ? xMessage : [],
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

  // xMessageConnect:
  // Connects two nodes using xMessage
  // @PARAMS:
  // sourceId: source node Id
  // targetId: target node Id
  xMessageConnect(sourceId, targetId) {
    // push sourceId's instance to targetId's xMessage
    this.nodes[targetId].data.inputs.xmessage.push(`${sourceId}.data.instance`)
  }

  // EDGE Creator:
  // Creates an edge between source and target
  // @PARAMS:
  // source: source node
  // target: target node
  // error: boolean (default false), if true then edge uses sorce's `onError` output anchor
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
