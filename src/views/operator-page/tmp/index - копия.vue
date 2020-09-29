<template><div class="tab-container">

  <div class="mixin-components-container">

    <el-row style="margin-top:0px;">

      <el-col><el-card class="box-card">
        <div class="clearfix" style="text-align: left; margin-bottom: 10px; font-style: italic">
          Выбрать тип виджета
        </div>

        <div class="clearfix" style="padding:0px; margin-bottom: 10px">
          <template v-for="(vidget, vname) in vidgetTypeList">
            <div class="text-center el-col el-col-2" style="width:17%; margin-right:10px;">
              <a
                class="pan-btn blue-btn"
                style="width: 100%; border-radius: 0px"
                @click="addNewVidget(vidget, vname)"
              > {{ vidget['description'] }} </a></div>
          </template>
        </div>
      </el-card></el-col>

    </el-row>

    <el-row><el-col>

      <!--<div class="dndList-list">-->
      <!--<h3>Выбор виджетов</h3>-->
      <!--<draggable-->
      <!--group="article"-->
      <!--class="dragArea"-->
      <!--:list="vidgetTypeList"  >-->
      <!--<div v-for="(element, fname) in vidgetTypeList" :key="fname" class="list-complete-item">-->
      <!--<div class="list-complete-item-handle2" @click="pushEle(element)" >-->
      <!--{{ element.description }}-->
      <!--</div>-->
      <!--</div>-->
      <!--</draggable>-->
      <!--</div>-->

      <section class="tasks">
        <h1 class="tasks__title">To do list</h1>

        <ul class="tasks__list">
          <li class="tasks__item">learn HTML</li>
          <li class="tasks__item">learn CSS</li>
          <li class="tasks__item">learn JavaScript</li>
          <li class="tasks__item">learn PHP</li>
          <li class="tasks__item">stay alive</li>
        </ul>

      </section>

    </el-col></el-row>

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
              <a
                class="pan-btn light-blue-btn"
                style="width: 100%; border-radius: 0px"
                @click="addNewDesktop()"
              > Создать рабочий стол</a></div>
          </div><hr>
          <div class="clearfix" style="text-align: center; margin-bottom: 10px">
            Список рабочих столов
          </div>
          <div class="component-item" style="height:420px;" />
        </el-card>
      </el-col>

      <template v-if="openNewDesktop || openEditDesktop">
        <el-col :span="8">
          <el-card class="box-card">
            <div class="clearfix" style="text-align: center; margin-bottom: 10px">
              {{ dekstopTitle }}
            </div><hr>
            <div class="component-item" style="height:420px;">

              <!--<drag-component-->
              <!--:list1="desktopVidgetList"-->
              <!--:list2="desktopVidgetList"-->
              <!--list1-title="List"-->
              <!--list2-title="Article pool"-->
              <!--/>-->

              <!--<template v-for="(vidget, i) in desktopVidgetList" >-->
              <!--<template v-for="(item, name) in vidget" >-->

              <!--<div v-if="name == 'table'" class="table-cont">-->
              <!--<el-col :span="5">-->
              <!--<el-card class="box-card">-->
              <!--<div slot="header" class="clearfix"></div>-->
              <!--<div style="height:30px;" ></div>-->
              <!--</el-card>-->
              <!--</el-col>-->
              <!--</div>-->
              <!--<div v-else-if="name == 'chart'" class="chart-cont">-->
              <!--<el-col :span="5">-->
              <!--<el-card class="box-card">-->
              <!--<div slot="header" class="clearfix"></div>-->
              <!--<div style="height:30px;" ></div>-->
              <!--</el-card>-->
              <!--</el-col>-->
              <!--</div>-->
              <!--</template></template>-->

              <!--<pre>{{desktopVidgetList}}</pre>-->

            </div>
          </el-card>
        </el-col>
      </template>

    </el-row>

  </div>

</div></template>

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
    TabPane
  },
  data() {
    return {
      taskElements: [],
      tasksListElement: {},

      openNewDesktop: true,
      openEditDesktop: false,
      dekstopTitle: 'Новый рабочий стол',

      desktopVidgetList: [],

      vidgetTypeList: {
        table: {
          description: 'Виджет «Таблица»',
          type: 'object',
          properties: {}
        },

        chart: {
          description: 'Виджет «График»',
          type: 'object',
          properties: {}
        },

        calendar: {
          description: 'Виджет «Календарь»',
          type: 'object',
          properties: {}
        },

        notifications: {
          description: 'Виджет «Уведомления»',
          type: 'object',
          properties: {}
        }
      }

    }
  }, // --- end data

  watch: {

  },

  created() {

  },

  mounted() {
    this.dragStyleInit()
  },

  methods: {

    addNewDesktop() {
      this.desktopVidgetList = []
      this.openNewDesktop = true
    },

    editDesktop() {
      this.desktopVidgetList = []
      this.openEditDesktop = true
    },

    addNewVidget(vidget, name) {
      const obj = {}
      obj[name] = vidget
      this.desktopVidgetList.push(obj)
    },

    dragStyleInit() {
      this.tasksListElement = document.querySelector(`.tasks__list`)
      this.taskElements = this.tasksListElement.querySelectorAll(`.tasks__item`)

      // Перебираем все элементы списка и присваиваем нужное значение
      for (const task of this.taskElements) {
        task.draggable = true
      }

      this.tasksListElement.addEventListener('dragstart', (evt) => {
        evt.target.classList.add('selected')
      })

      this.tasksListElement.addEventListener('dragend', (evt) => {
        alert('frtttt')
        evt.target.classList.remove('selected')
      })

      this.dragOverAction()
    },

    dragOverAction() {
      this.tasksListElement.addEventListener('dragover', (evt) => {
        // Разрешаем сбрасывать элементы в эту область
        evt.preventDefault()
        // debugger;
        // Находим перемещаемый элемент
        const activeElement = this.tasksListElement.querySelector(`.selected`)
        // Находим элемент, над которым в данный момент находится курсор
        const currentElement = evt.target
        // Проверяем, что событие сработало:
        // 1. не на том элементе, который мы перемещаем,
        // 2. именно на элементе списка
        const isMoveable = activeElement !== currentElement &&
                          currentElement.classList.contains(`tasks__item`)

        // Если нет, прерываем выполнение функции
        if (!isMoveable) {
          return
        }

        // Находим элемент, перед которым будем вставлять
        const nextElement = (currentElement === activeElement.nextElementSibling)
          ? currentElement.nextElementSibling
          : currentElement

        // Вставляем activeElement перед nextElement
        this.tasksListElement.insertBefore(activeElement, nextElement)
      })
    }
  }

}
</script>

<style scoped>
    .tab-container {
        margin: 30px;
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
