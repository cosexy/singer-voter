const ready = (callback) => {
  if (document.readyState !== 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

const toggleAuth = () => {
  document.querySelector('#toggleForm').addEventListener('click', (e) => {
    e.preventDefault()
    const $parent = document.querySelector('#form-auth')
    const type = $parent.getAttribute('data-type')
    // login
    if (type === 'login') {
      $parent.querySelector('#auth-title').textContent = 'Đăng Ký'
      $parent.querySelector('#submit').textContent = 'Đăng Ký'
      $parent.querySelector('#toggleForm').textContent = 'Đăng Nhập'
    } else {
      $parent.querySelector('#auth-title').textContent = 'Đăng Nhập'
      $parent.querySelector('#submit').textContent = 'Đăng Nhập'
      $parent.querySelector('#toggleForm').textContent = 'Đăng Ký'
    }
    $parent.setAttribute('data-type', type === 'login' ? 'register' : 'login')
  })
}

const authHandle = async () => {
  const $parent = document.querySelector('#form-auth')
  $parent.querySelector('#error-mess').textContent = ''
  const type = $parent.getAttribute('data-type')

  const email = $parent.querySelector('#email').value
  const password = $parent.querySelector('#password').value

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ email, password }),
    redirect: 'follow'
  }

  const response = await fetch(`/auth/${type}`, requestOptions)
  if (response.ok) {
    const { token } = await response.json()
    if (token) {
      Cookies.set('_token', token)
      window.location.href = '/'
    }
  } else {
    $parent.querySelector('#error-mess').textContent =
      type === 'login' ? 'Email hoặc mật khẩu không đúng' : 'Email đã tồn tại'
  }
}

const submitForm = () => {
  document.querySelector('#form-content').addEventListener('submit', ($el) => {
    $el.preventDefault()
    authHandle()
  })
}

ready(() => {
  toggleAuth()
  submitForm()
})
