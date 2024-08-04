async function emailValidator(msg) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const data = msg.payload.text
  const error = emailRegex.test(data)
  return {
    error: error,
    message: error
      ? 'Your response is not a valid email'
      : 'Thanks for your response',
  }
}

async function urlValidator(msg) {
  const urlRegex = /^(http|https):\/\/[^ "]+$/
  const data = msg.payload.text
  const error = urlRegex.test(data)
  return {
    error: error,
    message: error
      ? 'Your response is not a valid URL'
      : 'Thanks for your response',
  }
}

async function numberValidator(msg) {
  const numberRegex = /^\d+$/
  const data = msg.payload.text
  const error = numberRegex.test(data)
  return {
    error: error,
    message: error
      ? 'Your response is not a valid number'
      : 'Thanks for your response',
  }
}

async function dateValidator(msg) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  const data = msg.payload.text
  const error = dateRegex.test(data)
  return {
    error: error,
    message: error
      ? 'Your response is not a valid date'
      : 'Thanks for your response',
  }
}

async function phoneValidator(msg) {
  const phoneRegex = /^(\+91[-\s]?)?[6-9]\d{9}$/
  const data = msg.payload.text
  const error = phoneRegex.test(data)
  return {
    error: error,
    message: error
      ? 'Your response is not a valid phone number'
      : 'Thanks for your response',
  }
}

async function callOpenAI(msg) {
  const url = 'https://api.openai.com/v1/chat/completions' // Replace 'davinci-codex' with the appropriate model name if needed
  const apiKey = 'sk-proj-' // Replace with your actual OpenAI API key

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  const body = JSON.stringify({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI assitant helping a user fill in a form. Your job is to analyse the answer given by the user is valid for the question context provided and reiterate and reassure them if they feel uncomfortable or re-explain if they feel confused. You are to always return the response in the form on JSON with two only two keys, error and message, error is a boolean key which is true in case the answer is not relevant to the question and false if the answer is not relevant or is not validated and message is the respone you want to send to them to help them or thank them. Examples: {error: false, message: thanks for your response }; { error: true, message: your response is not relevant to the question }. Always make sure that the response you send back is parseable by JSON.parse() in NodeJS.',
      },
      {
        role: 'user',
        content: `I was prompted to enter the answer to this question: ${msg.transformer.metaData.currentQuestion}, this is the answer I submitted: ${msg.payload.text}.`,
      },
    ],
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // console.log(data);
    return JSON.parse(data.choices[0].message.content) // Adjust based on the response structure
  } catch (error) {
    console.error('Error:', error)
  }
}

const validator = {
  url: urlValidator,
  email: emailValidator,
  date: dateValidator,
  number: numberValidator,
  phone: phoneValidator,
  llm: callOpenAI,
}
