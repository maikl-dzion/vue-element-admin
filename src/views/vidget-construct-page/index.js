import DragService from '@/utils/drag-service'
import HttpService from '@/utils/http-request'

export default {
    name: 'ConstructVidget',
    mixins: [DragService],
    data() {
        const hostName = 'http://bolderfest.ru'
        const apiUrl = hostName + '/iac-dashboard/api/public/iac/dashboard'

        return {
            apiUrl: apiUrl, // api-url
            openDesktopState: false, // состояние рабочего стола
            selectElemName: '', // выбранное имя виджета

            userRoles : {},
            widgetSchema: {}, // общая схема виджетов
            widgetSettings: {}, // настройки виджетов
            desktopList: [], // список рабочих столов
            desktopWidgetList: [], // виджеты рабочего стола

            // -- Рабочий стол
            desktopItem: {
                desktop_id  : 0,
                role        : 'operator',
                name        : 'desktop-1',
                label       : 'Рабочий стол 1',
                description : 'desktop description',
                default_count_widget: 3, // количество отображаемых виджетов на столе
                widget_list : []
            },

            // -- Виждет
            widgetItem: {
                desktop_id : 0,
                widget_id  : 0,
                name       : '',
                label      : '',
                pos        : {},
                settings   : {},
                properties : {},
            },
        }
    }, // --- end data

    created() {
        this.getSchema();
        this.getWidgetSettrings();
        this.addNewDesktop();
        this.getDesktopList();
    },

    methods: {

        cloneItem(object) {
            const newObject = Object.assign({}, object)
            return newObject
        },

        // получаем схему виджетов
        getSchema() {
            const url = this.apiUrl + '/get-schema'
            HttpService({ url: url, method: 'get' }).then(response => {
                this.widgetSchema = JSON.parse(response)
                // debugger;
                // lg(typeof this.widgetSchema);
                for(name in this.widgetSchema.properties.roles.properties) {
                    let role = this.widgetSchema.properties.roles.properties[name];
                    this.userRoles[name] = role;
                }
                // lg(this.userRoles);
            })
        },

        // получаем настройки виджетов
        getWidgetSettrings() {
            const url = this.apiUrl + '/get-widget-settings'
            HttpService({ url: url, method: 'get' }).then(response => {
                this.widgetSettings = JSON.parse(response)
                // lg(typeof this.widgetSettings);
            })
        },

        // получаем список рабочих столов
        getDesktopList() {
            const url = this.apiUrl + '/desktop-list';
            HttpService({ url: url, method: 'get'})
                .then(response => {
                   this.desktopList = response;
                })
        },

        async getDesktopItem(desktop, index) {
            const itemId = desktop.desktop_id;
            this.editDesktop();
            const url = this.apiUrl + '/desktop-item/' + itemId;
            const response = await HttpService({url: url, method: 'get'})
            console.log(response);
            //this.desktopTitle = resp['title'];
            //this.desktopId    = resp['id'];
            // this.desktopWidgetList = [];
            // for (let i in resp['vidgets']) {
            //     let item = JSON.parse(resp['vidgets'][i]);
            //     this.desktopVidgetList.push(item)
            // }

        },

        // создаем новый рабочий стол
        addNewDesktop() {
            this._clear()
            this.desktopWidgetList = []
            this.openDesktopState = true
        },

        // создаем новый виджет
        addNewWidget(param) {
            const widget      = this.cloneItem(this.widgetItem)
            const widgetName  = this.selectElemName
            const widgetProps = this.cloneItem(this.widgetSchema['properties'][widgetName])
            const settings = this.cloneItem(this.widgetSettings['general_settings'])
            const wSetting = this.cloneItem(this.widgetSettings[widgetName])

            widget['name']       = widgetName
            widget['pos']        = param.pos
            widget['settings']   = Object.assign(settings, wSetting)
            widget['properties'] = widgetProps

            const item = this.cloneItem(Object.assign({}, widget))

            this.desktopWidgetList.push(item)
        },

        editWidget(param) {
            this.desktopWidgetList[this.elemIndex]['pos'] = param.pos
        },

        deleteWidget(index, vidget) {
            delete this.desktopWidgetList[index]
            const items = this.cloneItem(this.desktopWidgetList)
            this.desktopWidgetList = []
            for (const i in items) {
                this.desktopWidgetList.push(items[i])
            }
        },

        _clear() {
            // this.desktopId    = 0;
            // this.desktopName  = '';
            // this.desktopTitle = '';
        },

        saveDesktop(callback = null) {

            const url = this.apiUrl + '/post/desktop-save'
            this.desktopItem['widget_list'] = this.cloneItem(this.desktopWidgetList)
            const postData = this.desktopItem

            this.postRequest(url, postData)
                .then(response => console.log(response)) // обрабатываем результат вызова response.json()
                .catch(error   => console.error(error))
        },

        postRequest(url, data, headers = {}) {
            headers['Content-Type'] = 'application/json'
            return fetch(url, {
                headers: new Headers(headers),
                credentials: 'same-origin', // параметр определяющий передвать ли разные сессионные данные вместе с запросом
                method: 'POST', // метод POST
                body: JSON.stringify(data) //
            }).then(response => response.json()) // возвращаем промис
        },

        editDesktop() {
            // this.desktopLabel = 'редактирование';
            this._clear();
            this.desktopWidgetList = []
            this.openDesktopState = true
        },


        // addNewDesktop() {
        //     this.desktopLabel = 'создание';
        //     this.clearDate();
        //     this.desktopVidgetList = [];
        //     this.openNewDesktop = true;
        // },
        //
        // editDesktop() {
        //     this.desktopLabel = 'редактирование';
        //     this.clearDate();
        //     this.desktopVidgetList = []
        //     this.openEditDesktop = true
        // },
        //

        //
        // deleteVidget(index, vidget) {
        //
        //     delete this.desktopVidgetList[index];
        //     let items = Object.assign({}, this.desktopVidgetList);
        //     this.desktopVidgetList = [];
        //     for (let i in items) {
        //         this.desktopVidgetList.push(items[i]);
        //     }
        // },
        //
        // getDesktopList() {
        //     const url = this.apiUrl + '/desktop-list';
        //     HttpService({
        //         url: url,
        //         method: 'get'
        //     }).then(response => {
        //         this.desktopList = response;
        //     })
        // },
        //
        // async getDesktopItem(itemId) {
        //     this.editDesktop();
        //     const url = this.apiUrl + '/desktop/' + itemId;
        //     const resp = await HttpService({url: url, method: 'get'})
        //     this.desktopTitle = resp['title'];
        //     this.desktopId = resp['id'];
        //     this.desktopVidgetList = [];
        //     for (let i in resp['vidgets']) {
        //         let item = JSON.parse(resp['vidgets'][i]);
        //         this.desktopVidgetList.push(item)
        //     }
        //
        // },
        //

    }

}