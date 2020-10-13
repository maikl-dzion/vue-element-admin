<template>
  <div class="tab-container">
    <div class="mixin-components-container">

      <!-- НАБОР ВИДЖЕТОВ -->
      <el-row style="margin-top:0px;">
        <el-col>
          <el-card class="box-card">

            <div style="display: flex;" >
                <div class="clearfix" style="width:20%; text-align: left; margin-bottom: 10px; font-style: italic">
                   Выбрать тип виджета
                </div>
                <div class="clearfix"
                     style="width:50%; margin-bottom: 10px; margin-left: 10px;font-style: italic; display: flex"
                     ><input v-model="apiUrl"
                          style="border:1px gainsboro solid; padding:4px; width:60%; color:orangered; ">
                     <button @click="saveApiUrl()" style="cursor: pointer" >Сохранить ApiUrl</button>
                     <button @click="defaultApiUrl()" style="cursor: pointer; margin-left:10px;" >Default ApiUrl</button>
                </div>
            </div>

            <div class="clearfix" style="padding:0px; margin-bottom: 10px" >

              <template v-for="(widget, name) in widgetSchema.properties">
                <div
                  draggable="true"
                  class="text-center el-col el-col-2"
                  style="width:17%; margin-right:10px;"
                  @dragstart="dragStart($event, name)"
                  @dragend="dragEnd($event)"
                >
                  <a
                    class="pan-btn blue-btn"
                    style="width: 100%; border-radius: 0px"
                  > {{ widget['description'] }} </a>
                </div>
              </template>

            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row style="margin-top:0px;">

        <!-- СПИСОК РАБОЧИХ СТОЛОВ -->
        <el-col :span="5">
          <el-card class="box-card">
            <div class="clearfix" style="padding:0px; margin-bottom: 10px">
              <div class="text-center el-col el-col-40" style="width: 100%;">
                <a
                  class="pan-btn light-blue-btn"
                  style="width: 100%; border-radius: 0px"
                  @click="addNewDesktop()"
                > Создать рабочий стол</a>
              </div>
            </div>
            <hr>

            <div
              class="clearfix"
              style="text-align: center; margin-bottom: 10px"
            >Список рабочих столов</div>
            <hr>

            <div class="component-item" style="min-height:420px;">
              <!--<pre>{{desktopList}}</pre>-->
              <div v-for="(desktop, index) in desktopList" style="display: flex; border: 1px gainsboro solid; padding:2px; margin:2px; ">
                  <div style="width: 95%; margin:3px; padding:3px; border-bottom: 1px grey solid; cursor: pointer;"
                       @click="getDesktopItem(desktop, index)" > {{ desktop.label }}
                  </div>
                  <button style="height: 30px; margin: 2px 0px 0px 0px; cursor: pointer"
                          @click="deleteDesktopItem(desktop)" >
                          <i class="el-icon-delete" style="color:red;"/>
                  </button>
              </div>

            </div>
          </el-card>
        </el-col>

        <!--- РАБОЧИЙ СТОЛ ---------->
        <template v-if="openDesktopState">
          <el-col :span="19">
            <el-card class="box-card">
              <!-- Заголовок рабочего стола -->
              <div class="clearfix" style="margin-bottom: 5px; display: flex">
                <div style="width: 10%;">Рабочий стол</div>

                <div style="width:20%; border:0px red solid">
                  <div style="display: flex;">
                    <div style="width:100px; font-size: 14px; font-style: italic">Title</div>
                    <input v-model="desktopItem.label" style="border:1px gainsboro solid;">
                  </div>
                  <div style="display: flex;">
                    <div style="width:100px; font-size: 14px; font-style: italic">Name</div>
                    <input v-model="desktopItem.name" style="border:1px gainsboro solid;">
                  </div>
                </div>

                <div style="width:15%; text-align: left; margin: 0px 10px 0px 10px;">
                  <select v-model="desktopItem.role" style="width:100%">
                          <option v-for="(roleItem, name) in userRoles"
                            :value="name">{{ name }}</option>
                  </select>

                  <select v-model="desktopItem.system_id" style="width:100%">
                    <option v-for="(system, i) in systemList"
                            :value="system.id">{{ system.name }}</option>
                  </select>

                </div>

                <div style="width:40%; text-align: left; margin-left: 10px;">
                  <a class="pan-btn green-btn" style="width: 50%; text-align:center; border-radius: 0px; padding:10px;"
                     @click="saveDesktop()" > Сохранить рабочий стол </a>
                </div>

              </div><hr>

              <!-- Виджеты рабочего стола -->
              <div  class="drop-container"
                    style="height:464px; border:2px grey dotted"
                    @dragover="dragOverRun($event)"
                    @drop="dropStop($event)"
                    @dragleave="dragLeave($event)" >

                    <template v-for="(item, index) in desktopWidgetList">
                      <div
                        draggable="true"
                        :class="'vidget-item-box item__' + item.name"
                        :style="'margin-left:' + item.pos.left + 'px; ' + 'margin-top:' + item.pos.top +'px;'"
                        @dragstart="dragStartEdit($event, index, item)"
                        @dragend="dragEndEdit($event)"
                      >
                        {{ item.description }}
                        <div><i
                          class="el-icon-delete"
                          style="color:red; "
                          @click="deleteWidget(index, item)"
                        /></div>
                      </div>
                    </template>

              </div>

              <div
                class="text-center el-col el-col-40"
                style="width: 100%; margin:10px 0px 10px 0px;"
              />

            </el-card>
          </el-col>
        </template>

      </el-row>

      <div>

        <!--<pre>{{desktopItem}}</pre>-->

        <!--<pre>{{userRoles}}</pre>-->
        <!--<pre>{{elementPos}}</pre>-->
        <!--<pre>{{desktopWidgetList}}</pre>-->
        <!--<pre>{{widgetSettings}}</pre>-->
        <!--<pre>{{widgetSchema.properties}}</pre>-->
      </div>

    </div>
  </div>
</template>

<script src="./index.js" ></script>

<style scoped>
    .tab-container {
        margin: 30px;
    }

    .vidget-item-box {
        width: 60px;
        height: 40px;
        border: 1px gainsboro solid;
        position: absolute;
        font-size: 13px;
    }

    .item__table {
        width: 120px;
        height: 50px;
    }

    .item__chart {
        height: 70px;
    }

    .item__notifications {

    }

    .item__calendar {

    }

</style>
