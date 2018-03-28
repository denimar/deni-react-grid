import React from 'react';
import DataGridHeader from '../DataGridHeader';
import DataGridBody from '../DataGridBody';
import DataGridFooter from '../DataGridFooter';
import DataGridHelper from './DataGridHelper';
import DataGridApi from './DataGridApi';
import DataGridService from './DataGridService';
import ManagerRendererItems from './ManagerRendererItems';
import Constant from '../../util/Constant';
import './DataGrid.scss';

class DataGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      _showDataGrid.call(this);
    })
  }

  getSections() {
    return (
      <div className='ui-viewport'>
        <div className='ui-container'>
          <DataGridHeader />
          <DataGridBody />
          <DataGridFooter />
        </div>
      </div>
    );
  }

  render() {

    return (
      <div
        className={ 'ui-deni-grid' + (this.props.className ? ' ' + this.props.className : '') }
        ref={
          (elem) => {
            this.element = elem;
          }
        }
      >
        <div className='ui-deni-grid-wrapper'>
          <div className='ui-deni-grid-viewport'>

            <div className='ui-deni-grid-container'>

              <div className='ui-fixed-cols-viewport-wrapper'>
                { this.getSections() }
              </div>

              <div className='ui-variable-cols-viewport-wrapper'>
                { this.getSections() }
              </div>

            </div>

            <div className='ui-deni-grid-paging'></div>

          </div>

          {
            this.state.loading ? (
              <div className="ui-deni-grid-loading">
                <div className="image"></div>
                <div className="text">Loading...</div>
              </div>
            ) : null
          }

        </div>
      </div>
    );

  }

}

export default DataGrid;

function _showDataGrid() {
  //
  this.wrapper = this.element.querySelector('.ui-deni-grid-wrapper');
  this.viewport = this.wrapper.querySelector('.ui-deni-grid-viewport');
  this.container = this.viewport.querySelector('.ui-deni-grid-container');

  // *************************************************************************
  // VARIABLE COLUMNS
  // *************************************************************************
  this.colsViewportWrapper = this.container.querySelector('.ui-variable-cols-viewport-wrapper');
  this.colsViewport = this.colsViewportWrapper.querySelector('.ui-viewport');
  this.colsContainer = this.colsViewport.querySelector('.ui-container');

  // header
  this.headerViewportWrapper = this.colsContainer.querySelector('.ui-header-viewport-wrapper');
  this.headerViewport = this.headerViewportWrapper.querySelector('.ui-header-viewport');
  this.headerContainer = this.headerViewport.querySelector('.ui-header-container');
  // body
  this.bodyViewportWrapper = this.colsContainer.querySelector('.ui-body-viewport-wrapper');
  this.bodyViewport = this.bodyViewportWrapper.querySelector('.ui-body-viewport');
  this.bodyContainer = this.bodyViewport.querySelector('.ui-body-container');
  //footer
  this.footerViewportWrapper = this.colsContainer.querySelector('.ui-footer-viewport-wrapper');
  this.footerViewport = this.footerViewportWrapper.querySelector('.ui-footer-viewport');
  this.footerContainer = this.footerViewport.querySelector('.ui-footer-container');
  // *************************************************************************
  // *************************************************************************

  // *************************************************************************
  // FIXED COLUMNS
  // *************************************************************************
  this.fixedColsViewportWrapper = this.container.querySelector('.ui-fixed-cols-viewport-wrapper');
  this.fixedColsViewport = this.fixedColsViewportWrapper.querySelector('.ui-viewport');
  this.fixedColsContainer = this.fixedColsViewport.querySelector('.ui-container');

  // header
  this.fixedColsHeaderViewportWrapper = this.fixedColsContainer.querySelector('.ui-header-viewport-wrapper');
  this.fixedColsHeaderViewport = this.fixedColsHeaderViewportWrapper.querySelector('.ui-header-viewport');
  this.fixedColsHeaderContainer = this.fixedColsHeaderViewport.querySelector('.ui-header-container');
  // body
  this.fixedColsBodyViewportWrapper = this.fixedColsContainer.querySelector('.ui-body-viewport-wrapper');
  this.fixedColsBodyViewport = this.fixedColsBodyViewportWrapper.querySelector('.ui-body-viewport');
  this.fixedColsBodyContainer = this.fixedColsBodyViewport.querySelector('.ui-body-container');
  // footer
  this.fixedColsFooterViewportWrapper = this.fixedColsContainer.querySelector('.ui-footer-viewport-wrapper');
  this.fixedColsFooterViewport = this.footerViewportWrapper.querySelector('.ui-footer-viewport');
  this.fixedColsFooterContainer = this.footerViewport.querySelector('.ui-footer-container');
  // *************************************************************************
  // *************************************************************************

  //Set the controller to the service of the events. Always there'll be one controller to eache uiDeniGridEventsService
  //uiDeniGridEventsService.setController(vm);

  var currentHeight = this.element.offsetHeight + 'px';
  /*
  $timeout(function() {
  	if (this.element.css('height') != currentHeight) {
  		currentHeight = this.element.css('height');
  		this.wrapper.css('height', currentHeight);
  		this.element.css('height', currentHeight);
  	}
  }, 2000);
  */

  //Paging
  this.paging = this.viewport.querySelector('.ui-deni-grid-paging');

  //Set the default options
  DataGridHelper.setDefaultOptions(this, this.props.options);

  //
  DataGridHelper.ckeckInitialValueFilter(this, this.props.options.columns);

  //
  this.props.options.alldata = []; //It is used when I filter the data and there is a need to know the original data

  //Implement the ui-deni-grid's API
  let dataGridApi = new DataGridApi();
  dataGridApi.implementApi(this, this.element);

  ///////////////////////////////////////////////////////////////////////////
  //FIXED COLUMNS ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  if (this.props.options.fixedCols) {
    //
    this.fixedColsViewportWrapper.style.width = this.props.options.fixedCols.width + 'px';
    //
    this.colsViewportWrapper.style.width =  'calc(100% - ' + this.fixedColsViewportWrapper.style.width + ')';
  } else {
    //
    this.fixedColsViewportWrapper.style.display = 'none';
    //
    this.colsViewportWrapper.style.width = '100%';
  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  ///
  this.clientWidth = DataGridHelper.getClientWidthDeniGrid(this);

  ///////////////////////////////////////////////////////////////////////////
  //COLUMN HEADERS //////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  if (this.props.options.hideHeaders) {
    //
    this.headerViewportWrapper.style.display = 'none';
    this.fixedColsHeaderViewportWrapper.style.display = 'none';
  } else {
    //columnHeaderLevels has a numer greater than one when it has a grouped column headers.
    this.columnHeaderLevels = DataGridHelper.getColumnHeaderLevels(this, this.props.options.columns);

    if (this.columnHeaderLevels > 1) {
      //realPercentageWidth cause effect only when there are more then one level of columns
      DataGridHelper.setRealPercentageWidths(this.props.options.columns, '100%');
    }

    //
    let dataGridService = new DataGridService(this);
    dataGridService.createColumnHeaders(this, this.props.options.columns);
    dataGridService.createColumnHeadersEvents(this);

    //the height of the column headers varies when there is grouped column headers (Just in this case)
    this.headerViewportWrapper.style.height = 'calc(' + this.props.options.columnHeaderHeight + ' * ' + this.columnHeaderLevels + ')';
    this.fixedColsHeaderViewportWrapper.style.height = 'calc(' + this.props.options.columnHeaderHeight + ' * ' + this.columnHeaderLevels + ')';
  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////
  //GRID FOOTER /////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  if (this.props.options.colLines) {
    this.headerContainer.querySelectorAll('.ui-header-container-column').forEach(column => { column.style.borderRight = 'solid 1px silver' });
  }

  //How many column footer rows is there in the grid (footer.grid different from false)
  this.columnFooterRowsNumberGrid = DataGridHelper.getColumnFooterRowsNumber(this);
  //How many grouping footer rows is there in the grid (footer.grouping different from false)
  this.columnFooterRowsNumberGrouping = DataGridHelper.getColumnFooterRowsNumber(this, true);
  //
  this.columnFooterNumber = DataGridHelper.getColumnFooterNumber(this);

  //Should show the footer?
  if ((DataGridHelper.hasColumnFooter(this)) && (this.columnFooterRowsNumberGrid > 0)) {
    //
    DataGridHelper.createColumnFooters(this, this.footerContainer, this.props.options.columns, true);
    //How many footers?
    var columnFooterRowsNumber = this.footerContainer.querySelector('.ui-footer-row').length;
    //There is no need to add paadding when a footerRowTemplate was set
    var padding = angular.isDefined(this.props.options.footerRowTemplate) ? '0px' : '2px';
    this.footerViewportWrapper.css({
      'padding-top': padding,
      //'padding-bottom': padding,
      //'height': 'calc(' + this.props.options.columnFooterRowHeight + ' * ' + columnFooterRowsNumber + ' + (' + padding + ' * 2))'
    });
  } else {
    //
    this.footerViewportWrapper.style.display = 'none';
    this.fixedColsFooterViewportWrapper.style.display = 'none';
  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Paging
  if (this.props.options.paging) {
    this.paging.style.height = Constant.PAGING_HEIGHT;
    DataGridHelper.createPagingItems(this, this.paging, this.props.options.paging);
  }

  this.searchInfo = null; //hold values for render the field values (realce)
  this.searching = false;
  this.resizing = false;

  //This guy manages which items the grid should render
  this.managerRendererItems = new ManagerRendererItems(this);

  //
  DataGridHelper.remakeHeightBodyViewportWrapper(this);

  if (this.props.options.data) {
    this.element.api.loadData(this.props.options.data);
  } else if ((this.props.options.url) && (this.props.options.autoLoad)) {
    this.element.api.load();
  }

  _checkSize(this);
}

/*
 *
 *
 */
function _checkSize(dataGrid) {
  let isInvisible = ((dataGrid.element.style.display === 'none') || (dataGrid.element.style.visibility === 'hidden'));
  if ((!isInvisible) && (dataGrid.props.options.data)) {
    DataGridHelper.adjustAllColumnWidtsAccordingColumnHeader(dataGrid);
    dataGrid.element.api.repaint();
  }

  // angular.element(window).on('resize', function() {
  //   controller.scope.$apply();
  // });
}
