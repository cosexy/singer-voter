const ready = (callback) => {
  if (document.readyState !== 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

const logOutHandle = () => {
  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault()
    Cookies.remove('_token')
    window.location.href = '/'
  })
}

const initVoteModal = () => {
  document.querySelectorAll('#vote-modal ._close').forEach(($el) => {
    $el.addEventListener('click', (e) => {
      e.preventDefault()
      let $modal = document.querySelector('#vote-modal')
      $modal.classList.remove('is-active')
    })
  })
}

const toggleVote = () => {
  document.querySelectorAll('._vote_btn').forEach(($el) => {
    $el.addEventListener('click', async (e) => {
      const _vote_ID = e.target.getAttribute('data-vote')
      let $modal = document.querySelector('#vote-modal')
      $modal.classList.add('is-active')
      $modal.setAttribute('data-vote', _vote_ID)
    })
  })
}

const submitVote = () => {
  document.querySelector('#vote-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const _vote = Number(document.querySelector('#vote-num').value)

    if (_vote < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Số tim không hợp lệ',
        showConfirmButton: false,
        timer: 1500
      })
      return
    }

    const currentHeart = Number(
      document.querySelector('#currentHeart').innerText
    )

    if (_vote > currentHeart) {
      Swal.fire({
        icon: 'error',
        title: 'Số tim không đủ',
        showConfirmButton: false,
        timer: 1500
      })
      return
    }

    const _vote_ID = document
      .querySelector('#vote-modal')
      .getAttribute('data-vote')
    const _token = Cookies.get('_token')

    const res = await fetch('/actors/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_token}`
      },
      body: JSON.stringify({
        id: _vote_ID,
        vote: _vote
      })
    })

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Bình chọn thành công',
        showConfirmButton: false,
        timer: 1500
      })

      document.querySelector('#vote-modal').classList.remove('is-active')

      const likesEl = document.querySelector(
        `.ltn__product-item[data-actor="${_vote_ID}"] .likes`
      )

      const likes = Number(likesEl.innerText)
      likesEl.innerText = likes + _vote

      document.querySelector('#vote-num').value = ''

      // update array actorsData
      const actor = actorsData.find((actor) => actor._id === _vote_ID)
      actor.likes = likes + _vote

      document.querySelector('#currentHeart').innerText = currentHeart - _vote
    } else {
      console.log('error')
    }
  })
}

const toggleTop = () => {
  document.querySelector('#rank-btn').addEventListener('click', (e) => {
    e.preventDefault()

    let $modal = document.querySelector('#rank-modal')

    $modal.querySelector('.rank-content').innerHTML = ''
    const $template = document.createElement('div')
    $template.classList.add('rank-item')

    // insert html to template
    $template.innerHTML = `<div class="rank-img">
                            <a href="javascript:void(0)">
                                <img src="" alt="#">
                            </a>
                        </div>
                        <div class="rank-info">
                            <h2 class="rank-title">
                                <a href="javascript:void(0)"></a>
                            </h2>
                            <div class="rank-price" style="color: #e91e63;">

                               <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                >
                                <path
                                fill="currentColor"
                                d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z"
                                />
                                </svg>

                                <span class="likes" style="font-weight: 500"></span>
                            </div>
                        </div>`

    const rank = actorsData.sort((a, b) => b.likes - a.likes).slice(0, 10)

    rank.forEach((actor) => {
      const $item = $template.cloneNode(true)
      $item.querySelector('img').src = actor.avatar
      $item.querySelector('.rank-title a').innerText = actor.name
      $item.querySelector('.likes').innerText = actor.likes
      $modal.querySelector('.rank-content').appendChild($item)
    })

    $modal.classList.add('is-active')
  })

  document.querySelectorAll('#rank-modal ._close').forEach(($el) => {
    $el.addEventListener('click', (e) => {
      e.preventDefault()
      let $modal = document.querySelector('#rank-modal')
      $modal.classList.remove('is-active')
    })
  })
}

ready(() => {
  logOutHandle()
  toggleVote()
  initVoteModal()
  submitVote()
  toggleTop()

  // document.querySelector('#logout').addEventListener('click', (e) => {
  //   e.preventDefault()
  //   Cookies.remove('_token')
  //   window.location.href = '/'
  // })
})
