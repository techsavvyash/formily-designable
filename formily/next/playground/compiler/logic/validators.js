/**
 * Validation
 */

const skipQuestion = `
  if(!msg.payload.text == "SKIP") {
    if(!msg.transformer.metaData.validationResult) {
      msg.transformer.metaData.validationResult = {
        "${title}": {}
      };
    }

    msg.transformer.metaData.validationResult.${title} = {
      "skip-validation": {
        error: false,
        message: "User Skipped the message"
      }
    }
  }
`
