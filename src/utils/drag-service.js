const DragService = {
    name: 'DragService',

    data() {
        return {
            dragOverState  : false,
            dragOverInState: false,
            elementPos     : {},
            elemIndex      : -1,
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
                y_page: e.pageX,
            }

            return this[elemName] = pos;
        },


        //###########################################
        //### -- Контейнер куда перемещаем -- ######
        // -- Находимся над контейнером (перемещаемся над контейнером)
        dragOverRun(e) {
            e.preventDefault();

            this.setPosition(e, 'elementPos');

            if (this.elemIndex != -1) {
                this.dragOverInState = true;
            } else {
                this.dragOverState = true;
            }

        },

        // -- Отпускаем захваченный елемент
        dropStop(e) {
            e.preventDefault();

            if (this.dragOverState) {
                let vName = this.selectedVidgetName;
                let vidget = Object.assign({}, this.vidgetTypeList[vName])
                vidget['pos'] = this.elementPos;
                vidget['name'] = vName;
                this.addNewVidget(vidget, vName);
            }

            if (this.dragOverInState && this.elemIndex != -1) {
                this.elementPos.top  = this.elementPos.top - 20;
                this.elementPos.left = this.elementPos.left - 20;
                this.desktopVidgetList[this.elemIndex]['pos'] = this.elementPos;
            }

            this.dragOverInState = false;
            this.dragOverState = false;
        },

        // -- Выходим за пределы контейнера
        dragLeave(e) {
            this.dragOverInState = false;
            this.dragOverState = false;
        },
        //--------------------------------

        //###########################################
        //### -- Элемент который перемещаем -- ######
        dragStart(e, vidgetName) {
            this.selectedVidgetName = vidgetName;
        },

        dragEnd(e) {
            this.selectedVidgetName = '';
            this.dragOverState = false;
        },

        dragStart2(e, index, vidgetName) {
            this.elemIndex = index;
        },

        dragEnd2(e) {
            this.elemIndex = -1;
            this.dragOverInState = false;
        },
        //--------------------------------

    }, // End Methods

    mounted() {
        //window.addEventListener('scroll', this.handleScroll)
        //window.addEventListener('resize', this.handleResize)
    },
    activated() {
        //this.handleScroll()
    },
    destroyed() {
        //window.removeEventListener('scroll', this.handleScroll)
        //window.removeEventListener('resize', this.handleResize)
    },
}

export default DragService;