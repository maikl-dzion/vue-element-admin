import DragService from '@/utils/drag-service'
import HttpService from '@/utils/http-request'

export default {
    name: 'ConstructVidget',
    mixins: [DragService],
    data() {

        //const hostName = 'http://bolderfest.ru';
        //const apiUrl = hostName + '/iac-dashboard/api/public/iac/dashboard';

        return {
            apiUrl: '', // api-url
            openDesktopState: false, // состояние рабочего стола
            selectElemName: '', // выбранное имя виджета

            userRoles: {},
            widgetSchema: {}, // общая схема виджетов
            widgetSettings: {}, // настройки виджетов
            desktopList: [], // список рабочих столов
            desktopWidgetList: [], // виджеты рабочего стола
            desktopItem: {},

            // -- Рабочий стол
            desktopItemModel: {
                desktop_id: 0,
                system_id: 1,
                role: 'operator',
                name: 'desktop-1',
                label: 'Рабочий стол 1',
                description: 'desktop description',
                default_count_widget: 3, // количество отображаемых виджетов на столе
                widget_list: []
            },

            // -- Виждет
            widgetItemModel: {
                desktop_id: 0,
                widget_id: 0,
                name: '',
                label: '',
                pos: {},
                settings: {},
                properties: {}
            },

            systemList: [
                { id: 1, name: 'system-1',
                  label: 'Система 1',
                },

                { id: 2, name: 'system-2',
                  label: 'Система 2',
                }
            ],
        }
    }, // --- end data

    created() {

        this.desktopItem = this.cloneItem(this.desktopItemModel);

        this.getApiUrl();
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
            HttpService({url: url, method: 'get'}).then(response => {
                this.widgetSchema = JSON.parse(response)
                // debugger;
                // lg(typeof this.widgetSchema);
                for (name in this.widgetSchema.properties.roles.properties) {
                    const role = this.widgetSchema.properties.roles.properties[name]
                    this.userRoles[name] = role
                }
                // lg(this.userRoles);
            })
        },

        // получаем настройки виджетов
        getWidgetSettrings() {
            const url = this.apiUrl + '/get-widget-settings'
            HttpService({url: url, method: 'get'}).then(response => {
                this.widgetSettings = JSON.parse(response)
                // lg(typeof this.widgetSettings);
            })
        },

        // получаем список рабочих столов
        getDesktopList() {
            const url = this.apiUrl + '/desktop-list'
            HttpService({url: url, method: 'get'})
                .then(response => {
                    this.desktopList = response
                })
        },

        async getDesktopItem(desktop, index = 0) {
            const itemId = desktop.desktop_id
            this.editDesktop()
            const url = this.apiUrl + '/desktop-item/' + itemId
            const desktopItem = await HttpService({url: url, method: 'get'})
            this.desktopItem  = this.cloneItem(desktopItem);
            this.desktopWidgetList = [];
            // this.desktopWidgetList = this.cloneItem(this.desktopItem.widget_list);
            for(let i in this.desktopItem.widget_list) {
                let item = this.desktopItem.widget_list[i];
                this.desktopWidgetList.push(item);
            }
            this.desktopItem.widget_list = [];
        },

        // создаем новый рабочий стол
        addNewDesktop() {
            this._clear()
            this.desktopWidgetList = []
            this.openDesktopState = true;
            this.desktopItem = this.cloneItem(this.desktopItemModel);
        },

        // создаем новый виджет
        addNewWidget(param) {
            const widget = this.cloneItem(this.widgetItemModel)
            const widgetName = this.selectElemName
            const widgetProps = this.cloneItem(this.widgetSchema['properties'][widgetName])
            const settings = this.cloneItem(this.widgetSettings['general_settings'])
            const wSetting = this.cloneItem(this.widgetSettings[widgetName])

            widget['name'] = widgetName
            widget['pos'] = param.pos
            widget['settings'] = Object.assign(settings, wSetting)
            widget['properties'] = widgetProps

            const item = this.cloneItem(Object.assign({}, widget))

            this.desktopWidgetList.push(item)
        },

        editWidget(param) {
            this.desktopWidgetList[this.elemIndex]['pos'] = param.pos
        },

        deleteWidget(index, widget) {

            // delete this.desktopWidgetList[index]
            // const items = this.cloneItem(this.desktopWidgetList)
            // this.desktopWidgetList = []
            // for (const i in items) {
            //     this.desktopWidgetList.push(items[i])
            // }

            let widgetId = widget.widget_id;
            const url = this.apiUrl + '/delete-widget/' + widgetId
            this.getRequest(url)
                .then(response => {
                    console.log(response);
                    this.getDesktopItem(this.desktopItem);
                }).catch(error => {
                    console.error({url, error})
                })
        },

        deleteDesktopItem(desktop) {
            let desktopId = desktop.desktop_id;
            const url = this.apiUrl + '/delete-desktop-item/' + desktopId
            this.getRequest(url)
                .then(response => {
                    console.log(response);
                    this.getDesktopList();
                }).catch(error => {
                    console.error({url, error})
                })
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

            this.makeRequest(url, {}, postData, "POST")
                .then(response => {
                    // lg(response);
                    console.log(response);
                    this.getDesktopList();
                });

            // this.postRequest(url, postData)
            //     .then(response => {
            //         console.log(response);
            //         this.getDesktopList();
            //     }) // обрабатываем результат вызова response.json()
            //     .catch(error => {
            //         console.error({url, error})
            //         // lg({url, error});
            //     })
        },

        postRequest(url, data, headers = {}) {
            headers['Content-Type'] = 'application/json'
            return fetch(url, {
                headers    : new Headers(headers),
                credentials: 'same-origin', // параметр определяющий передвать ли разные сессионные данные вместе с запросом
                method     : 'POST', // метод POST
                body       : JSON.stringify(data) //
            }).then(response => response.json()) // возвращаем промис
        },

        makeRequest(url, headers = {}, data = null, method = "GET") {
            headers['Content-Type'] = 'application/json';
            return fetch(url, { method : method, headers: headers, body : JSON.stringify(data)})
                    .then(response => {
                        // let dataType = typeof response;
                        // lg(response);
                        //let result = response.json();
                        return response;
                    }).then(result => {
                        console.log('result',result);
                        return result;
                    }).catch(error => {
                        console.log('Request failed', error);
                        // lg(error);
                    });
        },

        getRequest(url, headers = {}) {
            headers['Content-Type'] = 'application/json'
            return fetch(url, {
                headers    : new Headers(headers),
                credentials: 'same-origin', // параметр определяющий передвать ли разные сессионные данные вместе с запросом
                method     : 'GET'          // метод GET
            }).then(response => response.json()) // возвращаем промис
        },

        editDesktop() {
            // this.desktopLabel = 'редактирование';
            this._clear()
            this.desktopWidgetList = []
            this.openDesktopState = true
        },

        //////////////////////
        // --- Api Url ------
        saveApiUrl() {
            localStorage.setItem('iac-desktop-api-url', this.apiUrl);
        },

        getApiUrl() {
            let apiUrl = localStorage.getItem('iac-desktop-api-url');
            if(!apiUrl) {
                this.defaultApiUrl();
                apiUrl = localStorage.getItem('iac-desktop-api-url');
            }

            this.apiUrl = apiUrl;
        },

        defaultApiUrl() {
            const hostName = 'http://bolderfest.ru';
            this.apiUrl = hostName + '/iac-dashboard/api/public/iac/dashboard';
            this.saveApiUrl();
        },
        /////////////////////


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
