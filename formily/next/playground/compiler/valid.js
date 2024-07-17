const valid = `function emailValidator(data, test) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
    return emailRegex.test(data)
  }
  
  function urlValidator(data, test) {
    const urlRegex = /^(http|https):\\/\\/[^ "]+$/
    return urlRegex.test(data)
  }
  
  function numberValidator(data, test) {
    const numberRegex = /^\\d+$/
    return numberRegex.test(data)
  }
  
  function dateValidator(data, test) {
    const dateRegex = /^\\d{4}-\\d{2}-\\d{2}$/
    return dateRegex.test(data)
  }
  
  const validator = {
    url: urlValidator,
    email: emailValidator,
    date: dateValidator,
    number: numberValidator,
  }
  `

export default valid
