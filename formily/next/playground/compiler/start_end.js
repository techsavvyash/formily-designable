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

const endNode = {
  id: 'CODE_RUNNER_END',
  position: {
    x: 3255.789032183661,
    y: -141.0959960862705,
  },
  type: 'customNode',
  data: {
    label: 'Code Runner Transformer',
    name: 'CODE_RUNNER',
    type: 'Output',
    category: 'GenericTransformer',
    description: 'A code runner capable of running custom JS code.',
    baseClasses: ['xMessage'],
    inputs: {
      xmessage: [], // will be filled by other code.
      code: 'const msg = JSON.parse($0);\nmsg.payload.text = "Thank You";\nreturn JSON.stringify(msg);',
    },
    outputs: {
      onSuccess: '',
      onError: '',
    },
    inputAnchors: [
      {
        label: 'XMessage',
        name: 'xmessage',
        type: 'xMessage',
        list: true,
        id: 'CODE_RUNNER_END-input-xmessage-xMessage',
      },
    ],
    inputParams: [
      {
        label: 'Code',
        name: 'code',
        type: 'ide',
        rows: 2,
        id: 'CODE_RUNNER_END-input-code-ide',
      },
      {
        id: 'CODE_RUNNER_END-input-sideEffects-json',
        label: 'SideEffects',
        name: 'sideEffects',
        rows: 2,
        type: 'json',
      },
    ],
    outputAnchors: [
      {
        id: 'CODE_RUNNER_END-output-onSuccess-xMessage',
        name: 'onSuccess',
        label: 'On Success',
        type: 'xMessage',
      },
      {
        id: 'CODE_RUNNER_END-output-onError-xMessage',
        name: 'onError',
        label: 'On Error',
        type: 'xMessage',
      },
    ],
    id: 'CODE_RUNNER_END',
    selected: false,
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

export { startNode, endNode }
