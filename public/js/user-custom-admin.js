const deleteListener = (element) => {
  const id = $(element).attr('data-id')
  if (id) {
    $.ajax({
      method: 'DELETE',
      url: `/users/${id}`,
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Xoá nhật thành công',
          showConfirmButton: false,
          timer: 1500
        })

        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    })
  }
}

const editListener = (element) => {
  $(element).on('click', () => {
    const id = $(element).attr('data-id')
    if (id) {
      const $modal = $('#exampleModalCenter')
      $('.custom-file-label').text('Choose file')

      document.querySelector('#form-actor').reset()

      const $row = $(`tr[row-id="${id}"]`)

      // second
      $modal.find('input[name="likes"]').val(
        Number(
          $row
            .find('td:nth-child(2)')
            .text()
            .replace(/[^0-9.-]+/g, '') || 0
        )
      )
      document.querySelector('._id_user').setAttribute('value', id)

      $modal.modal('show')
    }
  })
}

;(function ($) {
  $('#form-actor').on('submit', (e) => {
    e.preventDefault()
    const likes = Number(
      document.querySelector('._likes_input').value.replace(/[^0-9.-]+/g, '') ||
        0
    )
    if (likes < 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Số lượt thích không hợp lệ',
        showConfirmButton: false,
        timer: 1500
      })
    }

    const btn = $('#submit-actor')
    // acc class disabled
    btn.addClass('disabled')
    btn.attr('disabled', true)

    const id = document.querySelector('._id_user').getAttribute('value')

    // call ajax
    $.ajax({
      method: 'PUT',
      url: `/users/${id}`,
      data: {
        likes
      },
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          showConfirmButton: false,
          timer: 1500
        })

        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    })
  })

  $('.dataTablesCard ._delete').each((index, element) => {
    $(element).on('click', () => {
      deleteListener(element)
    })
  })

  $('.dataTablesCard ._edit').each((index, element) => {
    editListener(element)
  })

  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault()
    Cookies.remove('_token')
    window.location.href = '/'
  })
})(jQuery)
