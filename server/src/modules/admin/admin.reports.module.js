const path = require('path');
const { swapDatesIfPossible } = require('../utils/dates.utils.module');
const { REPORT_TYPES, MOST_SOLD_PRODUCTS_REPORT_QUERY, LESS_SOLD_PRODUCTS_REPORT_QUERY, EARNINGS_REPORT_QUERY, EXPENSE_REPORT_QUERY, BUILDING_SELECT_REPORT_QUERY, USER_SELECT_ALL_NO_PASS_QUERY, SIZE_SELECT_ALL_QUERY, PLEDGE_SELECT_QUERY, INVENTORY_SELECT_QUERY, MOST_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, LESS_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, EARNINGS_FILTER_DATES_REPORT_QUERY, EXPENSE_FILTER_DATES_REPORT_QUERY } = require('../../config/consts');
const db_connection = require(path.join(__dirname, "../database/db-connection"));


// main funtion to generate JSON, used to display a dynamic report table
async function generateReportJSON(_init_date, _end_date, reportType) {
    try {
        // get dates
        let _dates = swapDatesIfPossible(_init_date, _end_date);
        _end_date = _dates.end_date;
        _init_date = _dates.init_date;

        // check if using dates or not
        if (!_init_date || !_end_date) {
            return generateReportJSONNoDates(reportType);
        } else {
            return generateReportJSONWithDates(reportType, _init_date, _end_date);
        }
    } catch (error) {
        throw new Error("Unable to generate report: " + error);
    }
}

// generate report without dates
async function generateReportJSONNoDates(reportType) {
    let table_data = { titles: [], data: [] };
    switch (reportType) {
        case REPORT_TYPES.MOST_SOLD_PRODUCTS:
            table_data.titles = ["CODIGO", "NOMBRE", "TALLA", "TOTAL"];
            table_data.data = await queryReportNoDates(MOST_SOLD_PRODUCTS_REPORT_QUERY);
            break;
        case REPORT_TYPES.LESS_SOLD_PRODUCTS:
            table_data.titles = ["CODIGO", "NOMBRE", "TALLA", "TOTAL"];
            table_data.data = await queryReportNoDates(LESS_SOLD_PRODUCTS_REPORT_QUERY);
            break;
        case REPORT_TYPES.EARNINGS:
            table_data.titles = ["CODIGO", "NIT", "TOTAL(GTQ)", "FECHA", "USUARIO"];
            table_data.data = await queryReportNoDates(EARNINGS_REPORT_QUERY);
            break;
        case REPORT_TYPES.EXPENSES:
            table_data.titles = ["CODIGO", "GASTOS (GTQ)", "FECHA", "USUARIO"];
            table_data.data = await queryReportNoDates(EXPENSE_REPORT_QUERY);
            break;
        case REPORT_TYPES.BUILDINGS:
            table_data.titles = ["CODIGO", "NOMBRE", "DIRECCION"];
            table_data.data = await queryReportNoDates(BUILDING_SELECT_REPORT_QUERY);
            break;
        case REPORT_TYPES.USERS:
            table_data.titles = ["CODIGO", "NOMBRE", "AUTORIZADO", "AREA DE TRABAJO"];
            table_data.data = await queryReportNoDates(USER_SELECT_ALL_NO_PASS_QUERY);
            break;
        case REPORT_TYPES.SIZES:
            table_data.titles = ["TALLA"];
            table_data.data = await queryReportNoDates(SIZE_SELECT_ALL_QUERY);
            break;
        case REPORT_TYPES.PLEDGES:
            table_data.titles = ["CODIGO", "NOMBRE"];
            table_data.data = await queryReportNoDates(PLEDGE_SELECT_QUERY);
            break;
        default:
            table_data.titles = ["OPCION INVALIDA"]; // ignore
            break;
    }
    return table_data;
}

// generate report with dates
function generateReportJSONWithDates(reportType, _init_date, _end_date) {
    let table_data = { titles: [], data: [] };
    switch (reportType) {
        case REPORT_TYPES.MOST_SOLD_PRODUCTS:
            table_data.titles = ["CODIGO", "NOMBRE", "TALLA", "TOTAL"];
            table_data.data = queryReportWithDates(MOST_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, _init_date, _end_date);
        case REPORT_TYPES.LESS_SOLD_PRODUCTS:
            table_data.titles = ["CODIGO", "NOMBRE", "TALLA", "TOTAL"];
            table_data.data = queryReportWithDates(LESS_SOLD_PRODUCTS_FILTER_DATES_REPORT_QUERY, _init_date, _end_date);
        case REPORT_TYPES.EARNINGS:
            table_data.titles = ["CODIGO", "NIT", "TOTAL(GTQ)", "FECHA", "USUARIO"];
            table_data.data = queryReportWithDates(EARNINGS_FILTER_DATES_REPORT_QUERY, _init_date, _end_date);
        case REPORT_TYPES.EXPENSES:
            table_data.titles = ["CODIGO", "GASTOS (GTQ)", "FECHA", "USUARIO"];
            table_data.data = queryReportWithDates(EXPENSE_FILTER_DATES_REPORT_QUERY, _init_date, _end_date);
        default:
            return generateReportJSONNoDates(reportType);
    }
}

// generic funtion to execute querys with no parameters
function queryReportNoDates(REPORT_QUERY) {
    return new Promise((resolve, reject) => {
        db_connection.query(REPORT_QUERY, (error, result) => {
            if (error) {
                reject("No ha sido posible recuperar los datos necesarios para el reporte " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

// generic funtion to execute querys with no parameters
function queryReportWithDates(REPORT_QUERY, _init_date, _end_date) {
    return new Promise((resolve, reject) => {
        db_connection.query(REPORT_QUERY, [_init_date, _end_date], (error, result) => {
            if (error) {
                reject("No ha sido posible recuperar los datos necesarios para el reporte " + error); // Reject the Promise if there is an error
            } else {
                resolve(result);  // Resolve the Promise with the result
            }
        });
    });
}

module.exports = { generateReportJSON }