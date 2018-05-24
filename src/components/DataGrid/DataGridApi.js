import DataGridService from './DataGridService';

class DataGridApi {

  implementApi(dataGrid, element) {
    let dataGridService = new DataGridService(dataGrid)
    element.api = this._getApi(dataGrid, dataGridService)
    dataGrid.api = element.api
  }

  _getApi(dataGrid, dataGridService) {

    return {

      /**
       *
       *
       */
      clearSelections: function() {
        dataGridService.clearSelections(dataGrid);
      },

      /**
       *
       *
       */
      find: function(valuesToFind, opts) {
        return dataGridService.find(dataGrid, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findFirst: function(valuesToFind, opts) {
        return dataGridService.findFirst(dataGrid, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findKey: function(keyValue, opts) {
        return dataGridService.findKey(dataGrid, keyValue, opts);
      },

      /**
       *
       *
       */
      findLast: function(valuesToFind, opts) {
        return dataGridService.findLast(dataGrid, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findNext: function(valuesToFind, opts) {
        return dataGridService.findNext(dataGrid, valuesToFind, opts);
      },

      /**
       *
       *
       */
      findPrevious: function(valuesToFind, opts) {
        return dataGridService.findPrevious(dataGrid, valuesToFind, opts);
      },

      /**
       *
       *
       */
      filter: function(filterModel, opts) {
        return dataGridService.filter(dataGrid, filterModel, opts);
      },


      /**
       *
       *
       */
      getChangedRecords: function() {
        return dataGridService.getChangedRecords(dataGrid);
      },

      /**
       *
       *
       */
      getColumn: function(fieldName) {
        return dataGridService.getColumn(dataGrid, fieldName);
      },

      /**
       *
       *
       */
      getData: function() {
        return dataGrid.props.options.data
      },      

      /**
       *
       *
       */
      getEnabled: function(enabled) {
        return dataGrid.enabled;
      },

      /**
       *
       *
       */
      getPageNumber: function() {
        return dataGridService.getPageNumber(dataGrid);
      },

      /**
       *
       *
       */
      getRowHeight: function() {
        return dataGridService.getRowIndex(dataGrid);
      },

      /**
       *
       *
       */
      getRowIndex: function(record) {
        return dataGridService.getRowIndex(dataGrid, record);
      },


      /**
       *
       *
       */
      getSelectedRow: function() {
        return dataGridService.getSelectedRow(dataGrid);
      },

      /**
       *
       *
       */
      getSelectedRowIndex: function() {
        return dataGridService.getSelectedRowIndex(dataGrid);
      },

      /**
       *
       *
       */
      isEnableGrouping: function() {
        return dataGridService.isEnableGrouping(dataGrid);
      },

      /**
       *
       *
       */
      isGrouped: function() {
        return dataGridService.isGrouped(dataGrid);
      },

      /**
       *
       *
       */
      isRowSelected: function(row) {
        return dataGridService.isRowSelected(dataGrid, row);
      },

      /**
       * @param row {Element|Integer} Can be the rowIndex or a jquery element row
       *
       */
      isRowVisible: function(row) {
        return dataGridService.isRowVisible(dataGrid, row);
      },

      /**
       *
       *
       */
      load: function() {
        dataGridService.load(dataGrid);
      },

      /**
       *
       *
       */
      loadData: function(data) {
        dataGridService.loadData(dataGrid, data);
      },


      /**
       *
       *
       */
      isHideHeaders: function() {
        return dataGridService.isHideHeaders(dataGrid);
      },

      /**
       *
       *
       */
      reload: function() {
        return dataGridService.reload(dataGrid);
      },

      /**
       *
       *
       */
      removeRow: function(row) {
        dataGridService.removeRow(dataGrid, row);
      },

      /**
       *
       *
       */
      removeSelectedRows: function() {
        dataGridService.removeSelectedRows(dataGrid);
      },

      /**
       *
       *
       */
      resolveRowElement: function(row) {
        return dataGridService.resolveRowElement(dataGrid, row);
      },

      /**
       *
       *
       */
      resolveRowIndex: function(row) {
        return dataGridService.resolveRowIndex(dataGrid, row);
      },


      /**
       * forceRepaint force repaint all visible rows
       *
       */
      repaint: function(forceRepaint) {
        dataGridService.repaint(dataGrid, forceRepaint);
      },

      /**
       *
       *
       */
      repaintRow: function(row) {
        return dataGridService.repaintRow(dataGrid, row);
      },

      /**
       *
       *
       */
      repaintSelectedRow: function() {
        return dataGridService.repaintSelectedRow(dataGrid);
      },


      /**
       *
       *
       */
      setDisableGrouping: function() {
        dataGridService.setDisableGrouping(dataGrid);
      },

      /**
       *
       *
       */
      setEnableGrouping: function() {
        dataGridService.setEnableGrouping(dataGrid);
      },

      /**
       *
       *
       */
      setHideHeaders: function(hideHeaders) {
        return dataGridService.setHideHeaders(dataGrid, hideHeaders);
      },

      /**
       *
       *
       */
      selectAll: function() {
        dataGridService.selectAll(dataGrid);
      },

      /**
       *
       *
       */
      setEnabled: function(enabled) {
        dataGridService.setEnabled(dataGrid, enabled);
      },

      /**
       *
       *
       */
      selectRow: function(row, preventSelecionChange, scrollIntoView) {
        dataGridService.selectRow(dataGrid, row, preventSelecionChange, scrollIntoView);
      },

      /**
       *
       *
       */
      selectCell: function(row, col, preventSelecionChange, scrollIntoView) {
        dataGridService.selectCell(dataGrid, row, col, preventSelecionChange, scrollIntoView);
      },

      /**
       *
       *
       */
      setPageNumber: function(pageNumber) {
        dataGridService.setPageNumber(dataGrid, pageNumber);
      },

      /**
       *
       *
       */
      setRowHeight: function(rowHeight) {
        dataGridService.setRowHeight(dataGrid, rowHeight);
      },

      /**
       *
       *
       */
      setToogleGrouping: function() {
        dataGridService.setToogleGrouping(dataGrid);
      },


      /**
       *
       * holdSelection {boolean} true is default
       */
      sort: function(sorters, holdSelection) {
        dataGrid.props.options.sorters = dataGridService.sort(dataGrid, sorters, holdSelection);
        return dataGrid.props.options.sorters;
      },

      /**
       *
       *
       */
      updateSelectedRow: function(json) {
        dataGridService.updateSelectedRow(dataGrid, json);
      },

      /**
       *
       *
       */
      updateCell: function(rowIndex, colIndex, value) {
        dataGridService.updateCell(dataGrid, rowIndex, colIndex, value);
      },

      /**
       *
       *
       */
      updateSelectedCell: function(value) {
        dataGridService.updateSelectedCell(dataGrid, value);
      }
    };

  }

}

export default DataGridApi;
