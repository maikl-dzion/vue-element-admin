const DragService = {
  name: 'DragService',

  data() {
    return {
      dragOverState: false,
      dragOverInState: false,
      elementPos: {},
      elemIndex: -1
    }
  },

  methods: {

    setPosition(e, elemName = 'elementPos') {
      const pos = {
        top: e.offsetY,
        left: e.offsetX,
        x_offset: e.offsetX,
        y_offset: e.offsetY,
        x_page: e.pageX,
        y_page: e.pageX
      }

      this[elemName] = pos
      return pos
    },

    // ###########################################
    // ### -- Контейнер куда перемещаем -- ######
    // -- Находимся над контейнером (canvas)
    dragOverRun(e) {
      e.preventDefault()

      this.setPosition(e, 'elementPos')

      if (this.elemIndex != -1) {
        this.dragOverInState = true
      } else {
        this.dragOverState = true
      }
    },

    // -- Отпускаем захваченный елемент
    dropStop(e) {
      e.preventDefault()

      if (this.dragOverState) {
        // debugger;
        this.addNewWidget({ pos: this.elementPos })
      }

      if (this.dragOverInState && this.elemIndex != -1) {
        this.elementPos.top = this.elementPos.top - 20
        this.elementPos.left = this.elementPos.left - 20
        this.editWidget({ pos: this.elementPos })
      }

      this.dragOverInState = false
      this.dragOverState = false
    },

    // -- Выходим за пределы контейнера
    dragLeave(e) {
      this.dragOverInState = false
      this.dragOverState = false
    },
    // --------------------------------

    // ###########################################
    // ### -- Элемент который перемещаем -- ######
    dragStart(e, name) {
      // debugger;
      this.selectElemName = name
    },

    dragEnd(e) {
      this.selectElemName = ''
      this.dragOverState = false
    },

    dragStartEdit(e, index, name) {
      this.elemIndex = index
    },

    dragEndEdit(e) {
      this.elemIndex = -1
      this.dragOverInState = false
    }
    // --------------------------------

  }, // End Methods

  mounted() {
    // window.addEventListener('scroll', this.handleScroll)
    // window.addEventListener('resize', this.handleResize)
  },
  activated() {
    // this.handleScroll()
  },
  destroyed() {
    // window.removeEventListener('scroll', this.handleScroll)
    // window.removeEventListener('resize', this.handleResize)
  }
}

export default DragService
