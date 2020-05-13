/* eslint-disable */
// import * as apiTypes from "./XAIServlet.list";
import http from "@/common/axiosCaller";
import WebSocketCaller from "./AIOpsSocket";
import rtmParser from "./DataManger/rtmDataParser";
import widgetParser from "./DataManger/widgetDataParser";
let webSocketIns = null;
self.onmessage = function (e) {
    const data = e.data;
    const IP = data.ip; // 아이피 주소
    const PORT = data.port; // 포트 주소
    const VIEW_ID = data.viewId; // 화면 아이디
    const type = data.type; // 워커 분기처리 키값
    const responseType = data.responseType; // axios header
    const contentType = data.contentType; //axios header
    const param = data.param || {}; // 파라미터
    const URL = data.url || ""; // url 정보
    const baseURL = data.baseURL || ""; // url 정보
    const dataSet = data.dataSet || null;
    const subKey = data.subKey || null; // subscrebe 키값
    const key = data.key || null; // 소켓/서블릿 키값
    const urlInfo = data.urlInfo || null; // url 키값
    const typeSubcribe = data.typeSubcribe || "ws";  // 소켓 subscribe 타입

    // const handleSuccess = data.handleSuccess || null;
    // const handleError = data.handleError || null;


    let config;
    switch (type) {
        case "connect":
            config = {
                url: data.socketUrl,
                ip: IP,
            };
            webSocketIns = new WebSocketCaller(config);
            webSocketIns.wsOpen();
            break;
        case "rtm":
            const postData = {
                type: dataSet.type,
                data: dataSet,
            };
            rtmParser.dataTypePostMsg(postData);
            break;
        case "widgetData":
            const widgetData = {
                id,
                type: type,
                data: dataSet,
            };
            widgetParser.dataTypePostMsg(widgetData);
            // apiData.apiCaller( callList, clusterParam);
            // widgetParser.widgetApiCall(config);
            break;
        case "close":
            webSocketIns.wsDisconnect();
            break;
        case "subscribe":
            if (webSocketIns) {
                typeSubcribe === "ws" ? webSocketIns.wsSubscribe(param, urlInfo) :
                    webSocketIns.wsEventSubscribe(param, urlInfo, key, subKey);
            }
            break;
        case "unsubscribe":
            if (webSocketIns) {
                typeSubcribe === "all" ? webSocketIns.Allunsubscribe() :
                    webSocketIns.wsUnsubscribe(subKey);
            }
            break;
        case "delete":
            break;
        default:
            console.log("not Working Data", data)
    }


};


