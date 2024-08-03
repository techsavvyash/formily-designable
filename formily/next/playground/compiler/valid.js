const valid = `function emailValidator(data) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
  const error = emailRegex.test(data)
  return {
    error: !error,
    message: !error ? 'Your response is not a valid email' : 'Thanks for your response',
  }
}

function urlValidator(data) {
  const urlRegex = /^(http|https):\\/\\/[^ "]+$/
  const error = urlRegex.test(data)
  return {
    error: !error,
    message: !error ? 'Your response is not a valid URL' : 'Thanks for your response',
  }
}

function numberValidator(data) {
  const numberRegex = /^\\d+$/
  const error = numberRegex.test(data)
  return {
    error: !error,
    message: !error ? 'Your response is not a valid number' : 'Thanks for your response',
  }
}

function dateValidator(data) {
  const dateRegex = /^\\d{4}-\\d{2}-\\d{2}$/
  const error = dateRegex.test(data)
  return {
    error: !error,
    message: !error ? 'Your response is not a valid date' : 'Thanks for your response',
  }
}

function phoneValidator(data) {
  const phoneRegex = /^(\\+91[-\\s]?)?[6-9]\\d{9}$/
  const error = phoneRegex.test(data)
  return {
    error: !error,
    message: !error ? 'Your response is not a valid phone number' : 'Thanks for your response',
  }
}

const validator = {
  url: urlValidator,
  email: emailValidator,
  date: dateValidator,
  number: numberValidator,
  phone: phoneValidator,
}`

export default valid
