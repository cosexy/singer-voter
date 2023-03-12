const deleteListener = (element) => {
  const id = $(element).attr('data-id')
  if (id) {
    $.ajax({
      url: '/actors',
      type: 'DELETE',
      data: {
        id
      },
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Xoá thành công',
          showConfirmButton: false,
          timer: 1500
        })
        $('#example5')
          .DataTable()
          .row($(`tr[row-id="${id}"]`))
          .remove()
          .draw()
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Xoá thất bại',
          showConfirmButton: false,
          timer: 1500
        })
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

      $modal
        .find('input[name="name"]')
        .val($row.find('td:first-child span').text())

      // second
      $modal.find('input[name="likes"]').val(
        Number(
          $row
            .find('td:nth-child(2)')
            .text()
            .replace(/[^0-9.-]+/g, '') || 0
        )
      )

      // add id
      $modal.find('input[name="id"]').val(id)
      // reset file input
      $modal.find('input[name="avatar"]').val(null)

      // change title
      $modal.find('.modal-title').text('Edit Actor')
      $modal.find('#submit-actor').text('Update')

      // hide element
      $modal.find('._like_').show()

      $modal.addClass('edit')

      $modal.modal('show')
    }
  })
}

;(function ($) {
  $('#form-actor').on('submit', function (e) {
    e.preventDefault()
    const $form = $(this)
    const isEdit = document
      .querySelector('#exampleModalCenter')
      .classList.contains('edit')

    const name = $form.find('input[name="name"]').val()
    if (!name && !isEdit) {
      return Swal.fire({
        icon: 'error',
        title: 'Tên không được để trống',
        showConfirmButton: false,
        timer: 1500
      })
    }

    const avatar = $form.find('input[name="avatar"]')[0].files[0]
    if (!avatar && !isEdit) {
      return Swal.fire({
        icon: 'error',
        title: 'Ảnh đại diện không được để trống',
        showConfirmButton: false,
        timer: 1500
      })
    }

    const likes = Number($form.find('input[name="likes"]').val())
    if (likes < 0 && isEdit) {
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

    const createActor = (avatar) => {
      $.ajax({
        url: '/actors',
        type: 'POST',
        data: {
          name,
          avatar
        },
        success: (res) => {
          const table = $('#example5')
          const firstRow = table.find('tbody tr:first-child').clone()

          firstRow.attr('row-id', res.id)
          firstRow.find('td:first-child img').attr('src', res.avatar)
          firstRow.find('td:first-child span').text(res.name)
          // second row
          firstRow.find('td:nth-child(2)').text(res.likes)
          firstRow.find('td:nth-child(3) span').text(res.createdAt)
          firstRow.find('td:nth-child(4)').text(res.updatedAt)

          // button config
          firstRow.find('td:last-child').each((index, element) => {
            const btn = $(element).find('button')
            btn.attr('data-id', res.id)

            if (index === 0) {
              btn.on('click', () => editListener(btn))
            } else {
              btn.on('click', () => deleteListener(btn))
            }
          })

          // append to table
          table.find('tbody').prepend(firstRow)

          // reset DataTable
          // table.DataTable().rows().invalidate('data').draw(true)

          // close modal
          $('#exampleModalCenter').modal('hide')

          Swal.fire({
            icon: 'success',
            title: 'Thêm thành công'
          })

          // remove class disabled
          btn.removeClass('disabled')
          btn.attr('disabled', false)
        },
        error: () =>
          Swal.fire({
            icon: 'error',
            title: 'Thêm thất bại',
            showConfirmButton: false,
            timer: 1500
          })
      })
    }

    const updateActor = (_avatar) => {
      const id = $form.find('input[name="id"]').val()
      if (!id) {
        return Swal.fire({
          icon: 'error',
          title: 'ID không được để trống',
          showConfirmButton: false,
          timer: 1500
        })
      }
      $.ajax({
        url: '/actors',
        type: 'PUT',
        data: {
          id,
          name,
          avatar: _avatar,
          likes
        },
        success: (res) => {
          const row = $(`tr[row-id="${id}"]`)

          row.find('td:first-child img').attr('src', res.avatar)
          row.find('td:first-child span').text(res.name)
          // second row
          row.find('td:nth-child(2)').text(res.likes)
          row.find('td:nth-child(3) span').text(res.createdAt)
          row.find('td:nth-child(4)').text(res.updatedAt)

          // close modal
          $('#exampleModalCenter').modal('hide')

          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công'
          })

          // remove class disabled
          btn.removeClass('disabled')
          btn.attr('disabled', false)
        },
        error: () =>
          Swal.fire({
            icon: 'error',
            title: 'Thêm thất bại',
            showConfirmButton: false,
            timer: 1500
          })
      })
    }

    // submit avatar
    if (avatar) {
      const formData = new FormData()
      formData.append('images', avatar)
      $.ajax({
        url: '/images',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: (res) => (isEdit ? updateActor(res[0]) : createActor(res[0])),
        error: (err) => console.log(err)
      })
    } else {
      isEdit ? updateActor() : createActor()
    }
  })

  $('.dataTablesCard ._delete').each((index, element) => {
    $(element).on('click', function (e) {
      deleteListener(element)
    })
  })

  $('.dataTablesCard ._edit').each((index, element) => {
    editListener(element)
  })

  $('#add-actor').on('click', () => {
    const $modal = $('#exampleModalCenter')

    document.querySelector('#form-actor').reset()
    $('.custom-file-label').text('Choose file')

    // change title
    $modal.find('.modal-title').text('Add Actor')

    $modal.find('#submit-actor').text('Create')

    // show element
    $modal.find('._like_').hide()

    $modal.removeClass('edit')

    $('#exampleModalCenter').modal('show')
  })

  // listen input file custom-file-input
  $('.custom-file-input').on('change', function (e) {
    const file = e.target.files?.[0]

    const label = $('.custom-file-label')

    if (file) {
      // get file name
      const fileName = file.name
      // set file name to label
      label.text(fileName)
    } else {
      label.text('Choose file')
    }
  })

  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault()
    Cookies.remove('_token')
    window.location.href = '/'
  })
})(jQuery)
