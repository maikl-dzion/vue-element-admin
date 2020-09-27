<template>
    <div class="tab-container">

        <div class="mixin-components-container">

            <el-row style="margin-top:0px;">

                <el-col>
                    <el-card class="box-card">
                        <div class="clearfix" style="text-align: left; margin-bottom: 10px; font-style: italic">
                            Выбрать тип виджета
                        </div>

                        <!--<div class="clearfix" style="padding:0px; margin-bottom: 10px">-->
                            <!--<template v-for="(vidget, vname) in vidgetTypeList">-->
                                <!--<div class="text-center el-col el-col-2" style="width:17%; margin-right:10px;">-->
                                    <!--<a @click="addNewVidget(vidget, vname)" class="pan-btn blue-btn"-->
                                       <!--style="width: 100%; border-radius: 0px"> {{vidget['description']}} </a></div>-->
                            <!--</template>-->
                        <!--</div>-->

                        <div class="clearfix" style="padding:0px; margin-bottom: 10px">
                            <template v-for="(vidget, vname) in vidgetTypeList">
                                <div class="text-center el-col el-col-2"
                                     style="width:17%; margin-right:10px;"
                                     draggable="true"
                                     @dragstart="dragStart($event, vname)"
                                     @dragend="dragEnd($event)" >

                                     <a class="pan-btn blue-btn"
                                       style="width: 100%; border-radius: 0px"> {{vidget['description']}} </a>

                                </div>
                            </template>
                        </div>

                    </el-card>
                </el-col>

            </el-row>



            <el-row style="margin-top:0px;">

                <!--
                <el-col :span="4" >
                    <el-card class="box-card">
                        <div  class="clearfix" style="padding:0px; margin-bottom: 10px" >
                            <div class="text-center el-col el-col-40" style="width: 100%;">
                                <a href="#/documentation/index" class="pan-btn blue-btn"
                                   style="width: 100%; border-radius: 0px" > Таблица </a></div>
                        </div>
                    </el-card>
                </el-col>
                -->

                <el-col :span="5">
                    <el-card class="box-card">
                        <div class="clearfix" style="padding:0px; margin-bottom: 10px">
                            <div class="text-center el-col el-col-40" style="width: 100%;">
                                <a @click="addNewDesktop()" class="pan-btn light-blue-btn"
                                   style="width: 100%; border-radius: 0px"> Создать рабочий стол</a></div>
                        </div><hr>

                        <div class="clearfix" style="text-align: center; margin-bottom: 10px">
                            Список рабочих столов
                        </div><hr>

                        <div class="component-item" style="height:420px;">
                              <div v-for="(desk, i) in desktopList"
                                   style="margin:3px; border-bottom: 1px grey solid;" >
                                  {{desk.name}}
                              </div>
                        </div>

                        <pre>{{elemPos}}</pre>
                    </el-card>
                </el-col>

                <template v-if="openNewDesktop || openEditDesktop">
                    <el-col :span="12" >
                        <el-card class="box-card">
                            <div class="clearfix" style="text-align: center; margin-bottom: 10px">
                                {{dekstopTitle}}
                            </div><hr>

                            <div>
                                drop-state :{{dragOverState}} <br>
                                selected-name : {{selectedVidgetName}} <br>
                            </div>

                            <div class="drop-container"
                                 style="height:464px; border:2px grey dotted"
                                 @drop="drop($event)"
                                 @dragover="dragOverRun($event)"
                                 @dragleave="dragLeave($event)">

                                 <template v-for="(vidget, i) in desktopVidgetList" >
                                     <div class="vidget-item-box"
                                          :style="'margin-left:' + vidget.pos.left + 'px; margin-top:' + vidget.pos.top +'px'">
                                         {{vidget.description}}
                                     </div>
                                 </template>

                            </div>

                            <div class="text-center el-col el-col-40"
                                 style="width: 100%; margin:10px 0px 10px 0px;">
                                 <a @click="saveDesktop()" class="pan-btn green-btn"
                                   style="width: 100%; border-radius: 0px" > Сохранить рабочий стол </a></div>

                        </el-card>
                    </el-col>
                </template>

            </el-row>

        </div>

    </div>
</template>

<script>

    import draggable from 'vuedraggable'

    import TabPane from '../components/TabPane'
    import DragComponent from '../components/DragComponent'

    import PanThumb from '@/components/PanThumb'
    import MdInput from '@/components/MDinput'
    import Mallki from '@/components/TextHoverEffect/Mallki'
    import DropdownMenu from '@/components/Share/DropdownMenu'
    import waves from '@/directive/waves/index.js'

    export default {
        name: 'ConstructVidget',
        components: {
            draggable,
            DragComponent,
            PanThumb,
            MdInput,
            Mallki,
            DropdownMenu,
            TabPane,
        },
        data() {
            return {
                taskElements: [],
                tasksListElement: {},

                dragOverState: false,

                openNewDesktop: true,
                openEditDesktop: false,
                dekstopTitle: 'Новый рабочий стол',

                selectedVidgetName : '',

                desktopVidgetList: [],
                desktopList: [],

                elemPos : {},

                vidgetTypeList: {
                    table: {
                        description: "Виджет «Таблица»",
                        type: "object",
                        properties: {},
                    },

                    chart: {
                        description: "Виджет «График»",
                        type: "object",
                        properties: {},
                    },

                    calendar: {
                        description: "Виджет «Календарь»",
                        type: "object",
                        properties: {},
                    },

                    notifications: {
                        description: "Виджет «Уведомления»",
                        type: "object",
                        properties: {},
                    },
                },


            }
        },  // --- end data

        watch: {},

        created() {

        },

        mounted() {
            this.dragStyleInit();
            this.getDesktopList();
        },

        methods: {

            //-------------------------------
            // Находимся над контейнером
            dragOverRun(e) {
                e.preventDefault();
                this.dragOverState = true;

                const pos = {
                    off_x : e.offsetX,
                    off_y : e.offsetY,
                    p_x   : e.pageX,
                    p_y   : e.pageX,
                }

                this.elemPos = pos;
                // alert('Попали в область');
            },

            // Отпускаем захваченный елемент
            drop(e) {
                e.preventDefault();
                // debugger;

                if(this.dragOverState) {

                    let vName  = this.selectedVidgetName;
                    let vidget = this.vidgetTypeList[vName];
                    let pos = {
                        top  : this.elemPos.off_y,
                        left : this.elemPos.off_x
                    }

                    vidget['pos'] = pos;
                    vidget['name'] = vName;

                    this.addNewVidget(vidget, vName);

                    // let newDiv = document.createElement("div");
                    // newDiv.innerHTML = this.selectedVidgetName;
                    //
                    // newDiv.style.width = "50px";
                    // newDiv.style.border = "1px red solid";
                    // newDiv.style.marginTop  = this.elemPos.off_y + 'px';
                    // newDiv.style.marginLeft = this.elemPos.off_x + 'px';
                    //
                    // e.target.appendChild(newDiv);
                }

                this.dragOverState = false;
                //var data = e.dataTransfer.getData("text");
                //e.target.appendChild(document.getElementById(data));
            },

            // Выходим за пределы контейнера
            dragLeave(e) {
                this.dragOverState = false;
            },
            //--------------------------------


            //---------------------------------
            dragStart(e, vidgetName) {

                this.selectedVidgetName = vidgetName;

                //debugger;
                //e.dataTransfer.setData("text", e.target.id);
            },

            dragEnd(e) {
                this.selectedVidgetName = '';
                // debugger;
                //e.dataTransfer.setData("text", e.target.id);
            },
            //--------------------------------

            getDesktopList() {
                for(let i = 0; i < 10; i ++) {
                    const item = {
                        name : "Sistem " +  (i+1),
                        id   : (i+1),
                    }
                    this.desktopList.push(item);
                }
            },

            saveDesktop() {

            },

            addNewDesktop() {
                this.desktopVidgetList = [];
                this.openNewDesktop = true;
            },

            editDesktop() {
                this.desktopVidgetList = [];
                this.openEditDesktop = true;

            },

            addNewVidget(vidget, name = null) {
                //let obj = {};
                //obj[name] = vidget;
                this.desktopVidgetList.push(vidget);
            },


            dragStyleInit() {

                // this.tasksListElement = document.querySelector(`.tasks__list`);
                // this.taskElements = this.tasksListElement.querySelectorAll(`.tasks__item`);
                //
                // // Перебираем все элементы списка и присваиваем нужное значение
                // for (const task of this.taskElements) {
                //     task.draggable = true;
                // }
                //
                // this.tasksListElement.addEventListener('dragstart', (evt) => {
                //     evt.target.classList.add('selected');
                // })
                //
                // this.tasksListElement.addEventListener('dragend', (evt) => {
                //     evt.target.classList.remove('selected');
                // });

                // this.dragOverAction();
            },


            dragOverAction() {

                this.tasksListElement.addEventListener('dragover', (evt) => {
                    // Разрешаем сбрасывать элементы в эту область
                    evt.preventDefault();
                    // debugger;
                    // Находим перемещаемый элемент
                    const activeElement = this.tasksListElement.querySelector(`.selected`);
                    // Находим элемент, над которым в данный момент находится курсор
                    const currentElement = evt.target;
                    // Проверяем, что событие сработало:
                    // 1. не на том элементе, который мы перемещаем,
                    // 2. именно на элементе списка
                    const isMoveable = activeElement !== currentElement &&
                        currentElement.classList.contains(`tasks__item`);

                    // Если нет, прерываем выполнение функции
                    if (!isMoveable) {
                        return;
                    }

                    // Находим элемент, перед которым будем вставлять
                    const nextElement = (currentElement === activeElement.nextElementSibling) ?
                        currentElement.nextElementSibling :
                        currentElement;

                    // Вставляем activeElement перед nextElement
                    this.tasksListElement.insertBefore(activeElement, nextElement);
                });
            },

        },

    }
</script>

<style scoped>
    .tab-container {
        margin: 30px;
    }

    .vidget-item-box {
        width: 60px;
        height: 40px;
        border: 1px red solid;
        position: absolute;
    }

    /*body {*/
    /*font-family: "Tahoma", sans-serif;*/
    /*font-size: 18px;*/
    /*line-height: 25px;*/
    /*color: #164a44;*/

    /*background-color: #b2d9d0;*/
    /*}*/

    .tasks__title {
        margin: 50px 0 20px 0;

        text-align: center;
        text-transform: uppercase;
    }

    .tasks__list {
        margin: 0;
        padding: 0;

        list-style: none;
    }

    .tasks__item {
        transition: background-color 0.5s;
        margin-bottom: 10px;
        padding: 5px;

        text-align: center;
        border: 2px dashed #b2d9d0;
        border-radius: 10px;
        cursor: move;
        background-color: #dff2ef;

        transition: background-color 0.5s;
    }

    .tasks__item:last-child {
        margin-bottom: 0;
    }

    .selected {
        opacity: 0.6;
    }
</style>
