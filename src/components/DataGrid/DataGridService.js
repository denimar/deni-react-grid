import Routine from '../../util/Routine';
import DataGridHelper from './DataGridHelper';
import DeniGridEventService from './DeniGridEventService';
import axios from 'axios';
import Constant from '../../util/Constant'

class DataGridService {

    constructor(dataGrid) {
      this.dataGrid = dataGrid;
      this.deniGridEventService = new DeniGridEventService(this.dataGrid);
    }

    sum(number1, number2) {
      return number1 + number2;
    }

    /**
     *
     * remove all selections in the grid
     *
     */
     clearSelections(dataGrid) {
       dataGrid.bodyViewport.querySelectorAll('.ui-row.selected').forEach(elem => elem.classList.remove('selected'));
       dataGrid.fixedColsBodyViewport.querySelectorAll('.ui-row.selected').forEach(elem => elem.classList.remove('selected'));
       dataGrid.bodyViewport.querySelectorAll('.ui-cell.selected').forEach(elem => elem.classList.remove('selected'));
       dataGrid.fixedColsBodyViewport.querySelectorAll('.ui-cell.selected').forEach(elem => elem.classList.remove('selected'));
     }

    /**
     *
     * select all records in the grid
     *
     */
     selectAll(dataGrid) {
      if (dataGrid.props.options.multiSelect) {
        dataGrid.bodyViewport.querySelectorAll('.ui-row.selected').forEach(elem => elem.classList.add('selected'));
        dataGrid.bodyViewport.querySelectorAll('.ui-cell.selected').forEach(elem => elem.classList.add('selected'));
      } else {
        throw new Error('"selectAll" : to use selectAll method you must set multiSelect property to true!');
      }
     }


    /**
     *
     * @param headerContainerColumnRow optional comes filled just when we creating sub columns (grouped column headers)
     */
    createColumnHeaders(dataGrid, columnsToCreate, headerContainerColumnRow, level, colIndexStart) {
      var columns = [];

      var createDivHeaderContainerColumnRow = function(headerContainerColumn) {
        //ui-header-container-column-row
        var divHeaderContainerColumnRow = document.createElement('div');
        divHeaderContainerColumnRow.classList.add('ui-header-container-column-row');
        divHeaderContainerColumnRow.style.height = dataGrid.props.options.columnHeaderHeight;
        headerContainerColumn.appendChild(divHeaderContainerColumnRow);

        return divHeaderContainerColumnRow;
      };

      if (dataGrid.props.options.fixedCols) {

        //angular.copy(columnsToCreate, columns);
        Object.assign(columns, columnsToCreate);

        //Row Number?
        if (dataGrid.props.options.fixedCols.rowNumber) {
          columns.splice(0, 0, {
            width: Constant.FIXED_COL_ROWNUMBER_WIDTH,
            isFixedColumn: true
          });
        }

        //Indicator?
        if (dataGrid.props.options.fixedCols.indicator) {
          columns.splice(0, 0, {
            width: Constant.FIXED_COL_INDICATOR_WIDTH,
            isFixedColumn: true
          });
        }

        //CheckBox?
        if (dataGrid.props.options.fixedCols.checkbox) {
          columns.splice(0, 0, {
            width: Constant.FIXED_COL_CHECKBOX_WIDTH,
            isFixedColumn: true,
            isCheckbox: true
          });
        }
      } else {
        columns = columnsToCreate;
      }

      //
      var clientWidthParent = headerContainerColumnRow ? headerContainerColumnRow.width() : dataGrid.clientWidth;
      //
      //var columnHeaderLevels = DataGridHelper.getColumnHeaderLevels(me, this.options.columns);
      //
      var currentLevel = level || 1;

      //Any column was specified in percentage? TODO: create a function to get this
      var anyColumnInPercentage = false;
      for (var idx = 0 ; idx < dataGrid.props.options.columns.length ; idx++) {
        if (dataGrid.props.options.columns[idx].width.toString().indexOf('%') !== -1) {
          anyColumnInPercentage = true;
          break;
        }
      }

      //
      if (anyColumnInPercentage) {
        //dataGrid.headerViewport.css('width', 'calc(100% - 17px)');
        let scrollbarWidth = 15; //dataGrid.bodyViewport.offsetWidth - dataGrid.bodyViewport.scrollWidth;
        dataGrid.headerViewport.style.width = 'calc(100% - ' + scrollbarWidth + 'px)';
        dataGrid.headerContainer.style.width = '100%';
      }

      var colIndex = colIndexStart || 0;

      //
      for (let index = 0 ; index < columns.length ; index++) {
        var column = columns[index];

        //ui-header-container-column
        var divHeaderContainerColumn = document.createElement('div');

        //
        //if (anyColumnInPercentage) {
          divHeaderContainerColumn.style.width = column.width;
        //} else {
          //divHeaderContainerColumn.css('width', DataGridHelper.getRealColumnWidth(dataGrid, column.width, clientWidthParent));
        //}

        divHeaderContainerColumn.classList.add('ui-header-container-column');
        divHeaderContainerColumn.setAttribute('colindex', colIndex);
        if (Routine.isDefined(headerContainerColumnRow)) {
          if (index === 0) {
            divHeaderContainerColumn.classList.add('first-subcolumn');
          } else if (index === columns.length - 1) {
            divHeaderContainerColumn.classList.add('last-subcolumn');
          }
        }


        //ui-header-container-column-row
        var divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);

        //ui-header-cell
        var divHeaderCell = document.createElement('div');
        divHeaderCell.classList.add('ui-header-cell');
        divHeaderCell.setAttribute('colindex', colIndex);
        divHeaderCell.setAttribute('name', column.name);
        divHeaderCell.style.textAlign = column.align;
        divHeaderContainerColumnRow.appendChild(divHeaderCell);

        //ui-header-cell-inner
        var spanHeaderCellInner = document.createElement('span');
        spanHeaderCellInner.classList.add('ui-header-cell-inner');
        divHeaderCell.appendChild(spanHeaderCellInner);

        var headerCellDropdownMouseEnter = () => {
          let hasSubcolumns = Routine.getClosest(event.target, '.ui-header-cell').classList.contains('has-subcolumns');
          if (!hasSubcolumns) {
            let target = Routine.getClosest(event.target, '.ui-header-cell-dropdown');
            target.classList.add('active');
          }
        };

        if (column.isCheckbox) {
          var inputCheck = document.createElement('input');
          inputCheck.setAttribute('type', 'checkbox');
          inputCheck.style.cursor = 'pointer';
          divHeaderCell.style.textAlign = 'center';
          spanHeaderCellInner.append(inputCheck);
          inputCheck.change(function(event) {
            var checkboxes = dataGrid.fixedColsBodyContainer.querySelectorAll('.ui-cell-inner.checkbox').querySelectorAll('input[type=checkbox]');
            for (let index = 0 ; index < checkboxes.length ; index++) {
              checkboxes[index].checked = event.target.checked;
            }
          });

        } else {
          //dropdown menu
          var spanHeaderCellDropdown = document.createElement('span');
          spanHeaderCellDropdown.classList.add('ui-header-cell-dropdown');
          var spanHeaderCellDropdownIcon = document.createElement('span');
          spanHeaderCellDropdownIcon.classList.add('dropdown-arrow-down-icon');
          spanHeaderCellDropdown.appendChild(spanHeaderCellDropdownIcon);
          //spanHeaderCellDropdown.text('▼');

          spanHeaderCellDropdown.addEventListener('mouseenter', headerCellDropdownMouseEnter);
          spanHeaderCellDropdownIcon.addEventListener('mouseenter', headerCellDropdownMouseEnter);

          spanHeaderCellDropdown.addEventListener('mouseout', () => {
            if (!event.target.classList.contains('clicked')) {
              event.target.classList.remove('active');
            }
          });
          divHeaderCell.appendChild(spanHeaderCellDropdown);

          var content = column.header || column.name;
          spanHeaderCellInner.innerHTML = content || '';

          if (column.action) {
            //
            divHeaderContainerColumn.classList.add('action-button-column');
            //
            divHeaderCell.classList.add('action-button-column');
          }
        }


        //container param comes filled just when we creating sub columns (grouped column headers)
        if (Routine.isDefined(headerContainerColumnRow)) {
          headerContainerColumnRow.append(divHeaderContainerColumn);
        } else {

          //fixed column?
          if ((column.isFixedColumn) || (DataGridHelper.isFixedColumn(dataGrid, column.name))) {
            dataGrid.fixedColsHeaderContainer.append(divHeaderContainerColumn);
          } else {
            dataGrid.headerContainer.append(divHeaderContainerColumn);
          }
        }

        //
        if (dataGrid.columnHeaderLevels > 1) {
          //
          if  (column.columns) {
            //
            divHeaderContainerColumn.classList.add('has-subcolumns');
            //
            divHeaderCell.classList.add('has-subcolumns');
            //ui-header-container-column-row
            divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);
            //
            this.createColumnHeaders(dataGrid, column.columns, divHeaderContainerColumnRow, currentLevel+1, colIndex);
            //
            var lastColumnAdded = divHeaderContainerColumnRow.querySelector('.ui-header-container-column.last-subcolumn');
            colIndex = lastColumnAdded.getAttribute('colIndex');
          } else {
            if (currentLevel < dataGrid.columnHeaderLevels) {
              //
              var heightDivHeaderContainerColumnRow = divHeaderContainerColumnRow.style.height;
              //
              var missingLevels = dataGrid.columnHeaderLevels - currentLevel;
              //
              var calcNewHeight = 'calc(' + heightDivHeaderContainerColumnRow + ' + (' + dataGrid.props.options.columnHeaderHeight + ' * ' + missingLevels + '))';
              //
              divHeaderContainerColumnRow.css({
                height: calcNewHeight,
                  //'background-size': '1px ' + calcNewHeight
                  //'background-size': '1px 100%'
              });
            }
          }
        }

        colIndex++;
      }

    };

    /**
     *
     *
     */

    createColumnHeadersEvents(dataGrid) {
      var hrVerticalLineResizing;
      //var columnHeaderCellResizing;
      var headerContainerColumnResizing;
      var canResize = false;

      var updResizing = function() {
        //dataGrid.colsViewport.css('cursor', 'col-resize');
        //if ((columnHeaderCellResizing) && (event.which == 1)) {
          if (!Routine.isDefined(hrVerticalLineResizing)) {
            hrVerticalLineResizing = document.createElement('hr');
            hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
            dataGrid.colsViewport.append(hrVerticalLineResizing);
          }

          var leftResizing = event.pageX - dataGrid.colsViewport.offsetLeft;
          hrVerticalLineResizing.style.display = 'block';
          hrVerticalLineResizing.style.left = leftResizing + 'px';
          hrVerticalLineResizing.style.height = dataGrid.colsViewport.clientHeight + 'px';
      };

      var setResizing = function() {
        if (!hrVerticalLineResizing) {
          hrVerticalLineResizing = document.createElement('hr');
          hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
          dataGrid.colsViewport.append(hrVerticalLineResizing);
        }
        updResizing();
      };

      var setResizingOff = function() {
        dataGrid.resizing = false;
        //columnHeaderCellResizing = null;
        headerContainerColumnResizing = null;
        dataGrid.colsViewport.style.cursor = 'default';
        if (hrVerticalLineResizing) {
          hrVerticalLineResizing.style.display = 'none';
        }
      };

      //Mouse Down
      dataGrid.headerContainer.addEventListener('mousedown', event => {
        // if (!dataGrid.enabled) {
        //   return;
        // }

        let headerContainerColumn = Routine.getClosest(event.target, '.ui-header-container-column');
        if (headerContainerColumn) {
        //if (event.toElement.parentElement === dataGrid.headerContainer.get(0)) {
          if (canResize) {
            dataGrid.resizing = true;
          }

        }
        event.preventDefault();
        //event.stopImmediatePropagation(); //Prevent the mousedown that happening when we are resizing the columns
      });

      //It is necessary when there are grouped columns
      var adjustParentColumnsWidths = function(headerContainerColumn, differenceNewWidth) {
        //
        var headerContainerColumnParent = Routine.getParents(headerContainerColumn, '.ui-header-container-column:eq(0)');//headerContainerColumn.parents('.ui-header-container-column:eq(0)');
        if (headerContainerColumnParent.length > 0) {
          var children = headerContainerColumnParent[0].querySelectorAll('.ui-header-container-column');

          //couning border right width (1px)
          var borderWidths = children.length;
          //
          headerContainerColumnParent[0].width = (headerContainerColumnParent[0].offsetWidth + differenceNewWidth - borderWidths) + 'px';
          //
          return adjustParentColumnsWidths(headerContainerColumnParent[0], differenceNewWidth);
        }
        return headerContainerColumn;
      };

      //It is necessary when there are grouped columns
      var adjustChildrenColumnsWidths = function(headerContainerColumn, newWidth) {
        //
        var children = headerContainerColumn.querySelector('.ui-header-container-column');

        //
        if (children.length > 0) {
          //sum the widths
          var totalWidth = 0;
          for (let index = 0 ; index < children.length ; index++) {
            totalWidth += $(children[index]).width();
          }

          //get the column width percentage
          for (let index = 0 ; index < children.length ; index++) {
            var child = $(children[index]);
            var percentage = child.width() * 100 / totalWidth;

            child.style.width = (newWidth * percentage / 100) + 'px';
          }
        }
      };


      //Mouse Up
      document.addEventListener('mouseup', event => {
        // if (!dataGrid.enabled) {
        //   return;
        // }

        if (dataGrid.resizing) {
          if (headerContainerColumnResizing) {
            //
            //let leftResizing = event.pageX - dataGrid.colsViewport.offset().left;
            //let difference = event.clientX - headerContainerColumnResizing.getBoundingClientRect().right;
            let right = headerContainerColumnResizing.getBoundingClientRect().left + headerContainerColumnResizing.clientWidth;
            let difference = event.pageX - right;
            let newWidth = headerContainerColumnResizing.offsetWidth + difference;

            //It is necessary when there are grouped columns
            if (headerContainerColumnResizing.classList.contains('has-subcolumns')) {
              //
              let lastSubcolumn = headerContainerColumnResizing.querySelector('.ui-header-container-column.last-subcolumn');
              let lastSubcolumnWidth = lastSubcolumn.offsetWidth;
              //
              headerContainerColumnResizing.style.width = newWidth + 'px';

              //
              let borderWidth = 1;
              lastSubcolumn.width(lastSubcolumnWidth + difference + borderWidth);
              //DataGridHelper.adjustColumnWidtsAccordingColumnHeader(dataGrid, lastSubcolumn, lastSubcolumn.setAttribute('colindex'));
              //
              //adjustChildrenColumnsWidths($headerContainerColumnResizing, newWidth);

              ///////////////////////////////////////////////////////////////////////////////////////////
              // looking for children column headers - It is necessary when there are grouped columns
              ///////////////////////////////////////////////////////////////////////////////////////////
              //
              //
              //var headerContainerColumns = $headerContainerColumnResizing.querySelector('.ui-header-container-column');
              //for (let index = 0 ; index < headerContainerColumns.length ; index++) {
              //	var headerContainerColumn = $(headerContainerColumns.get(index));
              //	DataGridHelper.adjustColumnWidtsAccordingColumnHeader(dataGrid, headerContainerColumn, headerContainerColumn.setAttribute('colindex'));
              //}
              ///////////////////////////////////////////////////////////////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////////
            } else {

              //
              let lastAdjustedParent = adjustParentColumnsWidths(headerContainerColumnResizing, difference);
              //
              headerContainerColumnResizing.style.width = newWidth + 'px';
              //
              //DataGridHelper.adjustColumnWidtsAccordingColumnHeader(dataGrid, $headerContainerColumnResizing, $headerContainerColumnResizing.setAttribute('colindex'));
            }

            DataGridHelper.adjustAllColumnWidtsAccordingColumnHeader(dataGrid);

          }

          setResizingOff();
        }
        dataGrid.colsViewport.style.cursor = 'default';

        event.preventDefault();
      });


      // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this;
          var args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) {
              func.apply(context, args);
            }
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) {
            func.apply(context, args);
          }
        };
      };

      //Mouse Move
      document.addEventListener('mousemove', event => {
        // if (!dataGrid.enabled) {
        //   return;
        // }

        if (dataGrid.props.options.enableColumnResize) {

          if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
            if (dataGrid.resizing) {
              debounce(updResizing(), 100);
            }
          } else if (event.which === 0) { //event.which: left: 1, middle: 2, right: 3 (pressed)
            dataGrid.colsViewport.style.cursor = 'default';

            let headerContainerColumn = Routine.getClosest(event.target, '.ui-header-container-column');
            if (headerContainerColumn) {

              var columnHeadersCell = dataGrid.headerContainer.querySelectorAll('.ui-header-cell');
              canResize = false;
              //columnHeaderCellResizing = null;
              headerContainerColumnResizing = null;

              for (let index = 0 ; index < columnHeadersCell.length ; index++) {
                var columnHeaderCell = columnHeadersCell[index];

                var position = columnHeaderCell.getBoundingClientRect();
                if ((event.clientX > position.right - 2) && (event.clientX < position.right + 2)) {
                  canResize = true;
                  dataGrid.colsViewport.style.cursor = 'col-resize';
                  //columnHeaderCellResizing = columnHeaderCell;
                  headerContainerColumnResizing = Routine.getClosest(columnHeaderCell, '.ui-header-container-column');
                  break;
                }
              }

              if (canResize) {
                //setResizing();
              } else {
                //setResizingOff();
              }
            }
          }
        }

        event.preventDefault();
      });


      //
      var columnHeadersCell = dataGrid.headerContainer.querySelectorAll('.ui-header-cell');
      for (let index = 0 ; index < columnHeadersCell.length ; index++) {
        var columnHeaderCell = columnHeadersCell[index];

        //
        // Mouse Enter
        columnHeaderCell.addEventListener('mouseenter', (event) => {
          // if (!dataGrid.enabled) {
          //   return;
          // }

          event.currentTarget.classList.add('hover');
        });

        //
        // Mouse Leave
        columnHeaderCell.addEventListener('mouseleave', (event) => {
          // if (!dataGrid.enabled) {
          //   return;
          // }

          event.currentTarget.classList.remove('hover');
        });

        //
        // Mouse Up
        columnHeaderCell.addEventListener('mouseup', (event) => {
          // if (!dataGrid.enabled) {
          //   return;
          // }

          if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

            let target = event.target;
            let headerCell = Routine.getClosest(target, '.ui-header-cell');
            let fieldName = headerCell.getAttribute('name');
            let column = this.getColumn(dataGrid, fieldName);
            let isDropDownMenu = (target.classList.contains('ui-header-cell-dropdown') || target.classList.contains('dropdown-arrow-down-icon'));


            if (isDropDownMenu) {
              if (!headerCell.classList.contains('has-subcolumns')) {
                target.classList.add('active');
                target.classList.add('clicked');

                let mousePoint = this.getPositionDropDownMenuColumns(target);
                let dropdownMenuCallbackFunctionFn = function(column, execSortObj, execFilter) {
                  dropdownMenuCallbackFunction(dataGrid, column, execSortObj, execFilter);
                };
                let sortable = (dataGrid.props.options.sortableColumns && (column.sortable !== false));
                uiDeniGridDropdownService.open(dataGrid, sortable, column, mousePoint, dropdownMenuCallbackFunctionFn);
              }
            } else {
              if (dataGrid.colsViewport.style.cursor === 'default') { //prevent conflict with the resizing columns function
                if ((dataGrid.props.options.sortableColumns) && (column.sortable !== false)) {
                  let headerContainerColumn = Routine.getClosest(event.target, '.ui-header-container-column');

                  //Action column should not be ordered
                  if (!headerContainerColumn.classList.contains('action-button-column')) {
                    let headerCellInner = headerCell.querySelector('.ui-header-cell-inner');
                    let direction = 'ASC'; //default
                    if (headerCellInner.classList.contains('asc')) {
                      direction = 'DESC';
                    }

                    if (!headerContainerColumn.classList.contains('has-subcolumns')) {
                      dataGrid.refs.element.api.sort({name: headerCell.getAttribute('name'), direction: direction});
                    }
                  }
                }
              }
            }

          }
        });
      }

    };

    dropdownMenuCallbackFunction(dataGrid, column, execSortObj, execFilter) {
      dataGrid.headerContainer.querySelector('.ui-header-cell-dropdown').classList.remove('active clicked');

      if (execSortObj) {
        dataGrid.refs.element.api.sort(execSortObj);
      } else if (column.filter && execFilter) {
        dataGrid.refs.element.api.filter(dataGrid.scope.filterModel);
      }
    }

    /**
     *
     *
     *
     */
    getPositionDropDownMenuColumns(dropDowmButtonEl) {
      var xPos = 0;
      var yPos = 0;
      var el = dropDowmButtonEl;

      while (el) {
        if (el.tagName === 'BODY') {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          // for all other non-BODY elements
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
      }
      return {
        x: xPos,
        y: yPos + dropDowmButtonEl.offsetHeight - 1
      };
    }


    /**
     * TODO: It doesn't work when the data is grouped and its children are expanded... IMPROVE THAT!
       *
     * @param sorters {Array|Object|String} direction is optional
     * Example:
     * 		this.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
     * 		this.sort({name: 'city', direction: 'ASC'}); or
     *		this.sort('city');
     *		this.sort(function(rec1, rec2) {
     *			if (rec1.age == rec2.age) return 0;
     *			return rec1.age < rec2.age ? -1 : 1;
     *		});
     *
     */
    _sort(dataGrid, sorters) {
      var sortersArray;
      //Transform param to a Array
      if (Routine.isString(sorters)) { //passed a string
        sortersArray = [{name: sorters, direction: 'ASC'}];
      } else if (Routine.isObject(sorters)) {
        if (Routine.isArray(sorters)) { //passed a array
          sortersArray = sorters;
        } else { //passed a json
          sortersArray = [sorters];
        }
      } else if (Routine.isFunction(sorters)) { //Custom Sort
        sortersArray = [sorters];
      } else {
        throw new Error('"sort": param "sorters" passed in a wrong way');
      }

      if (dataGrid.props.options.data) {
        let self = this;
        var sortFn = function(array) {
          for (let index = 0 ; index < array.length ; index++) {
            var sort = array[index];
            var direction = sort.direction || 'ASC'; //default value
            //dataGrid.props.options.data = $filter('orderBy')(dataGrid.props.options.data, sort.name, direction.toUpperCase() === 'DESC');
            dataGrid.props.options.data = self._sortByColumn(dataGrid.props.options.data, sort.name, direction.toUpperCase() === 'DESC');
          }
        };
        // Are there fixed sorters?
        if (dataGrid.props.options.fixedSorters) {
          sortFn(dataGrid.props.options.fixedSorters);
        }

        sortFn(sortersArray);
      }

      return sortersArray;
    }

    _sortByColumn(data, columnName, desc) {
      return data.sort((a, b) => {
        let valueA = a[columnName];
        let valueB = b[columnName];
        if (desc) {
          if (valueA < valueB) return 1;
          if (valueA > valueB) return -1;
        } else {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
        }
        return 0;
      });
    }

    /*
     *
     *
     *
     */
    _repaintCardView(dataGrid, visibleRow) {
      //It might have more than one record by row whe is configured "cardView" property
      var recordsByRow = dataGrid.props.options.cardView.numberOfColumns;

      //
      var rowElement = $(document.createElement('div'));
      rowElement.classList.add('ui-row');
      rowElement.setAttribute('rowindex', visibleRow.rowIndex);
      rowElement.style.left = '0px';
      rowElement.style.height = visibleRow.height;
      rowElement.style.width = '100%';
      rowElement.style.top = visibleRow.top + 'px';
      rowElement.innerHTML = '<table class="ui-table-card-view"><tr></tr></table>';
      dataGrid.bodyContainer.append(rowElement);
      var rowTableRowCardView = rowElement.querySelector('tr').get(0);
      var colWidth = (100 / recordsByRow).toString() + '%';

      //
      for (let indexRecord = 0 ; indexRecord < recordsByRow ; indexRecord++) {
        var indexDataRecord = visibleRow.rowIndex;
        //
        if (visibleRow.rowIndex > 0) {
          indexDataRecord = ((visibleRow.rowIndex) * recordsByRow);
        }
        indexDataRecord += indexRecord;

        var record = dataGrid.props.options.data[indexDataRecord];

        var divCell = $(rowTableRowCardView.insertCell());
        divCell.style.width = colWidth;
        if (record) {
          var valueToRender = DataGridHelper.applyTemplateValues(dataGrid.props.options.cardView.template, record);
          divCell.innerHTML = valueToRender;
          divCell.prop('record', record);

          divCell.click(function(event) {
            dataGrid.bodyContainer.querySelector('td').classList.remove('selected');
            $(event.currentTarget).classList.add('selected');

            ////////////////////////////////////////////////////
            //onselectionchange event
            ////////////////////////////////////////////////////
            if (dataGrid.props.options.listeners.onselectionchange) {
              dataGrid.props.options.listeners.onselectionchange(dataGrid, dataGrid.refs.element, indexDataRecord, $(event.currentTarget).prop('record'));
            }
            ////////////////////////////////////////////////////
            ////////////////////////////////////////////////////

          });

          if (dataGrid.props.options.cardView.checkbox === true) {
            var checkboxCardView = $(document.createElement('input'));
            checkboxCardView.classList.add('checkbox');
            checkboxCardView.setAttribute('type', 'checkbox');
            if (dataGrid.checkedRecords.indexOf(record) !== -1) {
              checkboxCardView.setAttribute('checked', true);
            }
            checkboxCardView.click(function(event) {
              var rec = $(event.target.parent).prop('record');
              var indexOfRec = dataGrid.checkedRecords.indexOf(rec);

              if (indexOfRec !== -1) {
                dataGrid.checkedRecords.splice(indexOfRec, 1);
              }

              if (event.target.checked) {
                dataGrid.checkedRecords.push(rec);
              }

              if (dataGrid.props.options.listeners.oncheckboxchange) {
                dataGrid.props.options.listeners.oncheckboxchange(rec, dataGrid.checkedRecords, event.target);
              }
            });
            divCell.append(checkboxCardView);
          }

        }
      }
      visibleRow.rowElement = rowElement;
    }


    /*
     *
     *
     *
     */
    _repaintRow(dataGrid, rowIndex, forceRepaint, execAfterRepaintEvent, rowObject) {
      var itemRow = rowObject || dataGrid.managerRendererItems.getInfoRow(rowIndex);
      if (forceRepaint) {
        itemRow.rendered = false;
        if (Routine.isDefined(itemRow.rowElement)) {
          itemRow.rowElement.remove();
        }
        itemRow.rowElement = undefined;
      }

      if (!itemRow.rendered) {

        // Card View
        if (Routine.isDefined(dataGrid.props.options.cardView)) {
          this._repaintCardView(dataGrid, itemRow);

        // Not a Card View
        } else {
          var record = dataGrid.props.options.data[itemRow.rowIndex];
          itemRow.rowElement = this._renderRowEl(dataGrid, itemRow, record);
        }

        ///////////////////////////////////////////////
        // onafterrepaintrow event
        ///////////////////////////////////////////////
        if (itemRow.rowElement) {
          if (dataGrid.props.options.listeners.onafterrepaintrow) {
            dataGrid.props.options.listeners.onafterrepaintrow(itemRow.rowIndex, itemRow.rowElement);
          }
        }
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////


        if (execAfterRepaintEvent) {
          ///////////////////////////////////////////////
          // onafterrepaint event
          ///////////////////////////////////////////////
          //if (this.deniGridEventService.onafterrepaint) {
          setTimeout(() => {
            this.deniGridEventService.onafterrepaint(dataGrid);
          });
          //}
          ///////////////////////////////////////////////
          ///////////////////////////////////////////////
        }
      }
    }

    /*
     *
     *
     *
     */
    _repaint(dataGrid, forceRepaint) {

      /*
      //
      if (forceRepaint) {
        dataGrid.managerRendererItems.setAllElementsToNotRendered();
      }
      */

      //
      var visibleRows = dataGrid.managerRendererItems.getVisibleRows();

      //
      for (let index = 0 ; index < visibleRows.length ; index++) {
        var visibleRow = visibleRows[index];
        this._repaintRow(dataGrid, visibleRow.rowIndex, forceRepaint, null, visibleRow);
      }

      ///////////////////////////////////////////////
      // onafterrepaint event
      ///////////////////////////////////////////////
      //if (this.deniGridEventService.onafterrepaint) {
      setTimeout(() => {
        this.deniGridEventService.onafterrepaint(dataGrid);
      });

      //}
    ///////////////////////////////////////////////
      ///////////////////////////////////////////////

      // remove all not visible rows elements
      // preventing a overloading in the RAM memory
      //dataGrid.managerRendererItems.removeAllNotVisibleElementsRows(dataGrid, visibleRows);
    }

    /**
     * @param sorters {Array|Object|String} direction is optional
     * Example:
     * 		this.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
     * 		this.sort({name: 'city', direction: 'ASC'}); or
     *		this.sort('city');
     *
     */
    sort(dataGrid, sorters, holdSelection) {
      //var shouldHoldSelection = holdSelection == false ? false : true;
      var recordToHold;
      if (holdSelection !== false) {
        recordToHold = this.getSelectedRow(dataGrid);
      }

      dataGrid.headerContainer.querySelectorAll('span.ui-header-cell-inner').forEach(item => {
        item.classList.remove('sort');
        item.classList.remove('asc');
        item.classList.remove('desc');
      });


      var sortersArray;

      //GROUPING
      if (dataGrid.refs.element.api.isGrouped()) {
        sortersArray = this._sort(dataGrid, sorters);

        //
        dataGrid.bodyContainer.querySelector('.ui-row.collapse').filter(function() {
          var rowElementGroupExpanded = $(this);
          var groupIndex = parseInt(rowElementGroupExpanded.getAttribute('groupIndex'));
          var rowIndex = parseInt(rowElementGroupExpanded.getAttribute('rowindex'));
          var record = dataGrid.props.options.data[rowIndex];

          DataGridHelper.groupCollapse(dataGrid, rowElementGroupExpanded, record, rowIndex);
          DataGridHelper.groupExpand(dataGrid, rowElementGroupExpanded, record, rowIndex);
        });

      //ROW DETAIL
      } else if (dataGrid.props.options.rowDetails) {
        var recordsToExpand = [];
        //get the expanded lines
        var rowElementsExpanded = dataGrid.bodyContainer.querySelector('.ui-row.row-detail-expanded').filter(function() {
          var rowIndex = parseInt($(this).getAttribute('rowindex'));
          var record = dataGrid.props.options.data[rowIndex];
          recordsToExpand.push(record);
        });

        //
        sortersArray = this._sort(dataGrid, sorters);

        //
        dataGrid.refs.element.api.loadData(dataGrid.props.options.data);

        for (let index = 0 ; index < recordsToExpand.length ; index++) {
          var record = recordsToExpand[index];
          var rowIndex = dataGrid.refs.element.api.resolveRowIndex(record);
          var rowElement = dataGrid.refs.element.api.resolveRowElement(rowIndex);

          DataGridHelper.rowDetailsExpand(dataGrid, rowElement, record, rowIndex);
        }
        this._repaint(dataGrid);

      //COMMON ROW
      } else {
        sortersArray = this._sort(dataGrid, sorters);

        //
        dataGrid.refs.element.api.loadData(dataGrid.props.options.data);
      }


      for (let index = 0 ; index < sortersArray.length ; index++) {
        var sort = sortersArray[index];

        if (!Routine.isFunction(sort)) {
          var headerColElement = this._getHeaderColElementByName(dataGrid, sort.name, true);
          var headerCellInnerElem = headerColElement.querySelector('.ui-header-cell-inner');
          headerCellInnerElem.classList.add('sort');
          headerCellInnerElem.classList.add(sort.direction ? sort.direction.toLowerCase() : 'asc');
        }
      }

      //Call ui-deni-view method sort
      //dataGrid.refs.element.api.sort(sortersArray);

      if (recordToHold) {
        this.selectRow(dataGrid, recordToHold);
      }


      return sortersArray;
    }

    /**
     * @param raiseError {boolean} Raise a error when it is not found
     *
     */
    _getHeaderColElementByName(dataGrid, columnName, raiseError) {
      let column = dataGrid.headerContainer.querySelector('div.ui-header-cell[name="' + columnName + '"]');
      if (column) {
        return column;
      } else {
        if (raiseError) {
          throw new Error('There is not a columns with a name "' + columnName + '"!');
        } else {
          return null;
        }
      }
    }

    /**
     *
     */
    getSelectedRow(dataGrid) {
      if (dataGrid.rowIndex === undefined) {
        return null;
      } else {
        return dataGrid.props.options.data[dataGrid.rowIndex];
      }
    }

    /**
     *
     */
    getChangedRecords(dataGrid) {
      var changedRows = dataGrid.bodyViewport.querySelector('div.ui-row.changed');
      var data = dataGrid.props.options.data;
      var changedRecords = [];
      for (let index = 0 ; index < changedRows.length ; index++) {
        var rowIndex = $(changedRows[index]).setAttribute('rowindex');
        var changedRecord = data[rowIndex];
        changedRecords.push(changedRecord);
      }
      return changedRecords;
    }

    //
    //
    //
    //
    //
    //
    _resolveJavaScriptElement(element) {
      // If element is already a jQuery object
      if(Routine.isElement(element)) {
          return element.get(0);
      } else {
        return element;
      }
    }

    //
    //
    //
    //
    //
    //
    _resolveJQueryElement(element) {
      // If element is already a jQuery object
      if(Routine.isElement(element)) {
          return element;
      } else {
        return $(element);
      }
    }

    // This function help some other functions which get row parameter where sometimes
    // it comes like a record object and sometimes comes its recordIndex
    //
    // record {Object|Number} Can be passed rowIndex or the object record
    // returns the row
    _resolveRecord(dataGrid, record) {
      if (Routine.isObject(record)) {  //passed the object record
        return record;
      } else { //passed rowIndex
        return dataGrid.props.options.data[record];
      }
    }

    /**
     *	row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
     *
     */
    isRowSelected(dataGrid, row) {
      var rowElement = dataGrid.refs.element.api.resolveRowElement(row);
      return rowElement && rowElement.classList.contains('selected');
    }

    /**
     *
     * return a integer value (see also getSelectedRowIndexes)
     */
    getSelectedRowIndex(dataGrid) {
      return dataGrid.rowIndex;
    }

    /**
     *
     * return a array (see also getSelectedRowIndex)
     *
     */
    getSelectedRowIndexes(dataGrid) {
      var rowIndexes = [];

      //
      var selectedRows = dataGrid.bodyViewport.querySelector('.ui-row.selected');

      //
      for (let index = 0 ; index < selectedRows.length ; index++) {
        rowIndexes.push(parseInt($(selectedRows[index]).setAttribute('rowindex')));
      }

      return rowIndexes;
    }


    /**
     *	row {Object|Number} Can be passed rowIndex or the object record
     *  preventOnSelectionChange {Boolean} default false
     *  scrollIntoView {Boolean} default true
    */
    selectRow(dataGrid, row, preventOnSelectionChange, scrollIntoView) {
        if ((dataGrid.props.options.data) && (dataGrid.props.options.data.length > 0)) {

          //
          var rowElement;

          //
          if (Routine.isElement(row)) {
            //
            rowElement = row;
            //
            dataGrid.rowIndex	= parseInt(rowElement.setAttribute('rowindex'));
          } else {
            //
            var rowIndex;

            //
            if (dataGrid.refs.element.api.isGrouped()) {
              //
              rowIndex = dataGrid.refs.element.api.resolveRowIndex(row);
            //
            } else {
              rowIndex = dataGrid.refs.element.api.resolveRowIndex(row);
            }

            //
            //var rowElement = dataGrid.refs.element.api.resolveRowElement(row);

            //
            scrollIntoView = (scrollIntoView === false ? false : true);

            //
            if (rowIndex === -1) {
              throw new Error('selectRow: row passed in a wrong way!');
            }

            //
            let scrollIntoViewFn = function(rowElementToScroll) {
              if (scrollIntoView) {
                //if (!dataGrid.refs.element.api.isRowVisible(rowElementToScroll)) {
                //	rowElementToScroll.get(0).scrollIntoView(false);
                //}
              }
            };

            //if (rowIndex == dataGrid.rowIndex) {
            if (this.isRowSelected(dataGrid, rowIndex)) {
              //
              scrollIntoViewFn(rowIndex);
            } else {
              dataGrid.rowIndex = rowIndex;

              if (dataGrid.refs.element.api.isGrouped()) {
                let itemRow = dataGrid.managerRendererItems.getInfoRow(rowIndex);
                if (!itemRow) {
                  let groupIndex = dataGrid.props.options.data[rowIndex].groupIndex;
                  let groupInfo = dataGrid.managerRendererItems.getInfoGroup(groupIndex);
                  dataGrid.colsViewport.scrollTop = groupInfo.top;
                  this._repaint(dataGrid);
                  let record = dataGrid.props.options.data[rowIndex];
                  DataGridHelper.groupExpand(dataGrid, groupInfo.rowElement, record, rowIndex);
                  itemRow = dataGrid.managerRendererItems.getInfoRow(rowIndex);
                }

                dataGrid.colsViewport.scrollTop = itemRow.top;
                this._repaint(dataGrid);

                rowElement = itemRow.rowElement;
              } else {
                let rowHeight = parseInt(dataGrid.props.options.rowHeight.replace('px', ''));
                //let scrollTop = (rowIndex * rowHeight) - dataGrid.bodyViewportWrapper.height() / 2;
                //dataGrid.bodyViewport.scrollTop(scrollTop);
                this._repaint(dataGrid);
                let itemRow = dataGrid.managerRendererItems.getInfoRow(rowIndex);
                rowElement = itemRow.rowElement;
              }

            }
          }

          //
          if ((dataGrid.rowIndex !== undefined) && (!dataGrid.props.options.multiSelect)) {
            //remove all selections
            dataGrid.refs.element.api.clearSelections();
          }

          //
          rowElement.classList.add('selected');

          //
          dataGrid.bodyViewport.querySelectorAll('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]:not(.row-detail)').forEach(rowItem => {
            rowItem.querySelectorAll('.ui-cell').forEach(cellItem => { cellItem.classList.add('selected') });
          });

          //
          if (dataGrid.props.options.fixedCols) {
            //
            dataGrid.fixedColsBodyViewport.querySelector('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]:not(.row-detail)').querySelector('.ui-cell').classList.add('selected');

            var fixedRow = dataGrid.fixedColsBodyContainer.querySelector('.ui-fixed-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]:not(.row-detail)');
            if (fixedRow) {
              fixedRow.classList.add('selected');
              fixedRow.querySelector('.ui-cell.indicator').classList.add('selected');
            }
          }
          if (dataGrid.props.options.rowDetails) {
            rowElement.parent().querySelector('.ui-row.row-detail-container[rowindex="' + rowElement.getAttribute('rowindex') + '"]').classList.add('selected');
          }

          //
          //scrollIntoViewFn(rowElement);

          ////////////////////////////////////////////////////
          //onselectionchange event
          ////////////////////////////////////////////////////
          if (!preventOnSelectionChange) {
            if (dataGrid.props.options.listeners.onselectionchange) {
              dataGrid.props.options.listeners.onselectionchange(dataGrid, dataGrid.refs.element, dataGrid.rowIndex, dataGrid.props.options.data[dataGrid.rowIndex]);
            }
          }
          ////////////////////////////////////////////////////
          ////////////////////////////////////////////////////

      } else {
        throw new Error('"selectRow": There is not record to select!');
      }
    }

    /**
     *	row {Object|Number} Can be passed rowIndex or the object record
     *  preventOnSelectionChange {Boolean} default false
     *  scrollIntoView {Boolean} default true
     *  colIndex {Integer} Column Index.
    */
    selectCell(dataGrid, row, colIndex, preventOnSelectionChange, scrollIntoView) {
        if ((dataGrid.props.options.data) && (dataGrid.props.options.data.length > 0)) {

          //
          scrollIntoView = (scrollIntoView === false ? false : true);

          //
          var rowElement = dataGrid.refs.element.api.resolveRowElement(row);
        //
        if (row.length === 0) {
          throw new Error('selectCell: row passed in a wrong way!');
        }

          var divCell = rowElement.querySelector('.ui-cell[colIndex=' + colIndex + ']');
        //
        if (divCell.length === 0) {
          throw new Error('selectCell: colIndex passed in a wrong way!');
        }

        if (!dataGrid.props.options.multiSelect) {
          //remove all selections
          dataGrid.refs.element.api.clearSelections();
        }

        divCell.classList.add('selected');

          //
          var rowIndex = dataGrid.refs.element.api.resolveRowIndex(row);
        dataGrid.rowIndex = rowIndex;
        dataGrid.colIndex = colIndex;
      }
    }


    /**
     *
     *
    */
    getColumn(dataGrid, fieldName) {

        var _getColumn = function(columns, fieldName) {
          for (let i = 0 ; i < columns.length ; i++) {
            if (columns[i].columns) {
              var subColumn = _getColumn(columns[i].columns, fieldName);
              if (subColumn) {
                return subColumn;
              }
            } else {
              if (columns[i].name === fieldName) {
                return columns[i];
              }
            }
          }
          return null;
        }

        return _getColumn(dataGrid.props.options.columns, fieldName);
    }

    /**
     *
     *
    */
    updateSelectedRow(dataGrid, json) {

      if (dataGrid.rowIndex === undefined) {
        throw 'You have to select a record';
      } else {
        //
        var fieldsNotNested = DataGridHelper.prepareForNestedJson(json);
        //
        var keyFieldsToChange = Object.keys(fieldsNotNested);
        //
        var record = dataGrid.props.options.data[dataGrid.rowIndex];
        //
        var dataKeys = 	Object.keys(record);

        //
        for (let index = 0 ; index < keyFieldsToChange.length ; index++) {
          var fieldNameToChange = keyFieldsToChange[index];

          if (dataKeys.indexOf(fieldNameToChange) === -1) {
            console.warn('"updateSelectedRow" : field "' + fieldNameToChange + '" not found!');
          } else {
            //
            var newValue = eval('json.' + fieldNameToChange);
            record[fieldNameToChange] = newValue;
          }
        }

        //
        this._repaintRow(dataGrid, dataGrid.rowIndex, true, true);
      }
    }

    /**
     *
     *
    */
    updateCell(dataGrid, rowIndex, colIndex, value) {
      var rowElement = dataGrid.refs.element.api.resolveRowElement(rowIndex);
      var divCell = rowElement.querySelector('.ui-cell[colIndex=' + colIndex + ']');
      var spanCellInner = divCell.querySelector('.ui-cell-inner');
      spanCellInner.innerHTML = value;

      //
      divCell.classList.add('changed');
      //When we need the changed records we can get by ".ui-row.changed"
      Routine.getClosest(divCell, '.ui-row').classList.add('changed');
    }

    /**
     *
     *
    */
    updateSelectedCell(dataGrid, value) {

      if ((!Routine.isDefined(dataGrid.rowIndex)) || (!Routine.isDefined(dataGrid.colIndex))) {
        throw 'You have to select a record';
      } else {
        this.updateCell(dataGrid, dataGrid.rowIndex, dataGrid.colIndex, value);
      }

    }


    /**
     *
     *
    */
    isHideHeaders(dataGrid) {
      return dataGrid.props.options.hideHeaders;
    }

    /**
     *
     *
    */
    setHideHeaders(dataGrid, hideHeaders) {
      var display;
      if (hideHeaders) {
        display = 'none';
      } else {
        display = 'block';
      }
      dataGrid.colsViewport.querySelector('.ui-header-viewport').style.display = display;
      dataGrid.props.options.hideHeaders = hideHeaders;
    }

    /**
     *
     *
     */
    getPageNumber(dataGrid) {
      return dataGrid.props.options.paging.currentPage;
    }

    /**
     *
     *
     */
    setPageNumber(dataGrid, pageNumber) {
      //dataGrid.props.options.paging.currentPage = pageNumber;
      dataGrid.paging.querySelector('input.input-page-number').value = pageNumber;
      this.reload(dataGrid, pageNumber);
      this._checkDisableButtonsPageNavigation(dataGrid, dataGrid.props.options.data, pageNumber);
    }

    /**
     *
     *
     */
    _checkDisableButtonsPageNavigation(dataGrid, data, pageNumber) {
      var firstButton = dataGrid.paging.querySelector('.button.button-first');
      var prevButton = dataGrid.paging.querySelector('.button.button-prev');
      var nextButton = dataGrid.paging.querySelector('.button.button-next');
      var lastButton = dataGrid.paging.querySelector('.button.button-last');
      var backwards = (data.length > 0) && (pageNumber > 1);
      var forwards = (data.length > 0) && (pageNumber < dataGrid.props.options.paging.pageCount);

      var additionalButtons = dataGrid.paging.querySelector('.button.button-additional');
      if (additionalButtons) {
        if (data.length > 0) {
          additionalButtons.classList.remove('disabled');
        } else {
          additionalButtons.classList.add('disabled');
        }
      }

      if (backwards) {
        firstButton.classList.remove('disabled');
        prevButton.classList.remove('disabled');
      } else {
        firstButton.classList.add('disabled');
        prevButton.classList.add('disabled');
      }

      if (forwards) {
        nextButton.classList.remove('disabled');
        lastButton.classList.remove('disabled');
      } else {
        nextButton.classList.add('disabled');
        lastButton.classList.add('disabled');
      }
    }

    _getPropertyXML(properties, item, parentProperty) {
      var property = item.nodeNathis.toLowerCase();
      if (parentProperty) {
        property = parentProperty + '.' + property;
      }
      if (properties.indexOf(property) === -1) {
        properties.push(property);

        for (let index = 0 ; index < item.children.length ; index++) {
          _getPropertyXML(properties, item.children[index], property);
        }
      }
    }

    /**
     *
     *
     */
    isArrayItem(itemToBeAnalyzed) {
      if ((Routine.isDefined(itemToBeAnalyzed.children)) && (itemToBeAnalyzed.children.length > 0)) {
        var propName = '';
        for (var i = 0 ; i < itemToBeAnalyzed.children.length ; i++) {
          if (propName === '') {
            propName = itemToBeAnalyzed.children[i].nodeNathis.toLowerCase();
          } else {
            if (itemToBeAnalyzed.children[i].nodeNathis.toLowerCase() !== propName) {
              return false;
            }
          }
        }

        return true;
      } else {
        return false;
      }
    }

    /**
     *
     *
     */
    _getRecordXML(records, item, parentNode) {
      var record = parentNode ? parentNode : {};

      for (let index = 0 ; index < item.children.length ; index++) {
        var property = item.children[index];
        var propertyName = property.nodeNathis.toLowerCase();

        if (property.children.length === 0) {
          record[propertyName] = property.textContent;
        } else {
          if (isArrayItem(property)) {
            var valueArray = [];
            for (var childIndex = 0 ; childIndex < property.children.length ; childIndex++) {
              _getRecordXML(valueArray, property.children[childIndex]);
            }
            record[propertyName] = valueArray;
          } else {
            record[propertyName] = {};
            _getRecordXML(records, property, record[propertyName]);
          }
        }
      }
      if (!Routine.isDefined(parentNode)) {
        records.push(record);
      }
    }


    /**
     *
     *
     */
    _xmlToJson(dataGrid, xml) {
      var xmlData = $(xml);
      var items = xmlData.querySelector(dataGrid.props.options.restConfig.data).querySelector(dataGrid.props.options.restConfig.dataItems);
      var records = [];
      for (let index = 0 ; index < items.length ; index++) {
        _getRecordXML(records, items[index]);
      }

      var jsonReturn = {
        success: true,
      };
      jsonReturn[dataGrid.props.options.restConfig.data] = records;
      jsonReturn[dataGrid.props.options.restConfig.total] = parseInt(xmlData.querySelector(dataGrid.props.options.restConfig.total).text());

      return jsonReturn;
    }

    /**
     *
     *
     */
    _getDefaultRequestPromise(url) {
      return new Promise((successFn, failureFn) => {
        axios.get(url)
          .then((response) => {
            successFn(response)
          })
          .catch((err) => {
            failureFn(err);
          });
      });

        /*
      var deferred = $q.defer();
      $http.get(url)
        .then(
          function(response) {
            deferred.resolve(response);
          },
          function(response) {
            deferred.reject(response);
          }
        );

      return deferred.promise;
      */
    }

    /**
     * pageNumber Optional param
     *
     */
    load(dataGrid, pageNumber) {
      //let deferred = $q.defer();
      return new Promise((sucessFn, failureFn) => {
        if (dataGrid.props.options.url) {
          if (!dataGrid.props.options.data) {
            dataGrid.bodyViewport.classList.add('initilizing-data');
          }
          let url = dataGrid.props.options.url;

          if (dataGrid.props.options.paging) {
            dataGrid.props.options.paging.currentPage = pageNumber || 1;
            let page = dataGrid.props.options.paging.currentPage;
            dataGrid.paging.querySelector('input.input-page-number').value = page;
            let limit = dataGrid.props.options.paging.pageSize;
            let start = (page - 1) * limit;

            if (url.indexOf('?') === -1) {
              url += '?';
            } else {
              url += '&';
            }

            url += 'page=' + page + '&' + dataGrid.props.options.restConfig.start + '=' + start + '&' + dataGrid.props.options.restConfig.limit + '=' + limit;
          }

          if (dataGrid.props.options.filter && dataGrid.props.options.filter.remote) {
            //Is any filter set?
            if (Object.keys(dataGrid.props.options.filter.model).length !== 0) {
              if (url.indexOf('?') === -1) {
                url += '?';
              } else {
                url += '&';
              }

              url += 'filter=' + JSON.stringify(dataGrid.props.options.filter.model);
            }
          }

          //var loading = dataGrid.wrapper.querySelector('.ui-deni-grid-loading');
          //loading.css('display', 'block');
          var requestPromise = dataGrid.props.options.requestPromise;
          if (!dataGrid.props.options.requestPromise) {
            requestPromise = this._getDefaultRequestPromise;
          }

          dataGrid.loading = true;
          requestPromise(url)
            .then(function(response) {
              dataGrid.loading = false;

              var responseData;

              if (dataGrid.props.options.restConfig.type === 'xml') {
                responseData = _xmlToJson(dataGrid, response.data);
              } else {
                responseData = response.data;
              }
              if (Routine.isArray(responseData)) {
                responseData = {
                  success: true,
                  data: responseData,
                  total: responseData.length
                };
              }

              //
              if (dataGrid.props.options.paging) {
                //
                dataGrid.props.options.paging.dataLength = responseData[dataGrid.props.options.restConfig.total];

                dataGrid.props.options.paging.pageCount = Math.ceil(dataGrid.props.options.paging.dataLength / dataGrid.props.options.paging.pageSize);

                //
                dataGrid.refs.element.api.loadData(responseData[dataGrid.props.options.restConfig.data]);
                sucessFn(responseData[dataGrid.props.options.restConfig.data]);

                //
                dataGrid.paging.querySelector('.label-page-count').innerHTML = 'of ' + dataGrid.props.options.paging.pageCount;

                //
                var limit = dataGrid.props.options.paging.pageSize;
                var start = (dataGrid.props.options.paging.currentPage - 1) * limit;
                var end = start + dataGrid.props.options.paging.pageSize;

                if (end > dataGrid.props.options.paging.dataLength) {
                  end = dataGrid.props.options.paging.dataLength;
                }
                dataGrid.paging.querySelector('.label-displaying').innerHTML = start + ' - ' + end;

                dataGrid.paging.querySelector('.label-record-count').innerHTML  = dataGrid.props.options.paging.dataLength + ' records';

              } else {
                //
                dataGrid.refs.element.api.loadData(responseData[dataGrid.props.options.restConfig.data]);
                sucessFn(responseData[dataGrid.props.options.restConfig.data]);
              }

              dataGrid.bodyViewport.classList.remove('initilizing-data');
            },
            function(response) {
              dataGrid.loading = false;
              failureFn(response.statusText);
              });
        } else {
          dataGrid.loading = false;
          failureFn('"load" : To use load function is necessary set the url property.');
        }
      });
    }

    /**
     * pageNumber Optional param
     *
     */
    reload(dataGrid, pageNumber) {
      return this.load(dataGrid, pageNumber);
    }


    /**
     *
     *
     */
    loadData(dataGrid, data) {
      ///////////////////////////////////////////////////////////////////////////
      //BeforeLoad Event
      ///////////////////////////////////////////////////////////////////////////
      if (dataGrid.props.options.listeners.onbeforeload) {
        dataGrid.props.options.listeners.onbeforeload(data, dataGrid.props.options);
      }
      //////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      //Are there footer?
      if (DataGridHelper.hasColumnFooter(dataGrid)) {
        //
        DataGridHelper.renderColumnFooters(dataGrid, dataGrid.footerContainer, dataGrid.props.options.columns, data, true);
        //
        DataGridHelper.remakeHeightBodyViewportWrapper(dataGrid);
      }


      //
      dataGrid.renderedIndexes = [];

      //
      let filterModelKeys = Object.keys(dataGrid.props.options.filter.model);

      //Load the data
      if ((dataGrid.props.options.filter) && (filterModelKeys.length > 0) && (!dataGrid.props.options.filter.remote)) {
        let matchFilterFn = function(originalValue, valueToFilter) {

          //When valueToFilter comes from a multi select filter value, enter in this if
          if (Routine.isArray(valueToFilter)) {
            let matched = false;
            for (let index = 0 ; index < valueToFilter.length ; index++) {
              let valueToFilterItem = valueToFilter[index];
              if (matchFilterFn(originalValue, valueToFilterItem)) {
                matched = true;
              } else {
                matched = false;
                break;
              }
            }
            return matched;
          } else {
            if (valueToFilter.oper === '=') {
              return originalValue.toString().toLowerCase() === valueToFilter.value.toString();
            } else if (valueToFilter.oper === '~') {
              //Case Insensitive Comparation
              return originalValue.toString().search(new RegExp(valueToFilter.value, 'i')) !== -1;
            } else if (valueToFilter.oper === '<=') {
              return valueToFilter.value <= originalValue;
            } else if (valueToFilter.oper === '>=') {
              return valueToFilter.value >= originalValue;
            } else {
              throw new Error('Invalid operator!');
            }
          }
        };
        let columns = dataGrid.props.options.columns;
        dataGrid.props.options.data = $filter('filter')(data, function(record, index, array) {
          if (dataGrid.props.options.filter.allFields) {
            for (let colIndex = 0 ; colIndex < columns.length ; colIndex++) {
              let colName = columns[colIndex].name;
              let value = record[colName];
              if (value) {
                if (matchFilterFn(value, dataGrid.props.options.filter.model['*'])) {
                  return true;
                }
              }
            }
          } else {
            let filterOk = false;
            for (let index = 0 ; index < filterModelKeys.length ; index++) {
              let valuesToFilterKey = filterModelKeys[index];
              let valueToFilter = dataGrid.props.options.filter.model[valuesToFilterKey];
              let value = eval('record.' + valuesToFilterKey);

              if (value && valueToFilter) {
                if (matchFilterFn(value, valueToFilter)) {
                  filterOk = true;
                } else {
                  return false;
                }
              }
            }
            return filterOk;
          }

          return false;
        });
      } else {
        dataGrid.props.options.data = data;
      }

      dataGrid.props.options.alldata = data;

      //Records inside Grouping
      dataGrid.groupRecords = [];
      //Data Grouping itself
      dataGrid.props.options.dataGroup = [];

      //Remmove all rows before load
      let uiRow = dataGrid.bodyContainer.querySelector('.ui-row');
      while (uiRow) {
        uiRow.remove();
        uiRow = dataGrid.bodyContainer.querySelector('.ui-row');
      }
      let uiFixedRow = dataGrid.fixedColsBodyContainer.querySelector('.ui-row');
      while (uiRow) {
        uiFixedRow.remove();
        uiFixedRow = dataGrid.fixedColsBodyContainer.querySelector('.ui-row');
      }

      //
      var rowHeight = parseInt(dataGrid.props.options.rowHeight.replace('px', ''));

      //
      dataGrid.rowsPerPage = parseInt(dataGrid.bodyViewport.clientHeight / rowHeight) + 1;
      var limitLength = (data.length < dataGrid.rowsPerPage ? data.length : dataGrid.rowsPerPage);

      //
      //
      // GROUPING
      if (dataGrid.refs.element.api.isGrouped()) {
        var expressionToGroup = dataGrid.props.options.grouping.expr;

        var getEvalFieldValue = function(record, fieldName) {
          return eval('record.' + fieldName);
        };

        var getEvalExpressionValue = function(record, expression) {
          var evalStr = '(function() {\n' +
                    '		with (record) {\n' +
                  '				return ' + expression + '\n' +
                  '		}\n' +
                  '})()';

          return eval(evalStr);
        };

        var fieldsNotNested = DataGridHelper.prepareForNestedJson(dataGrid.props.options.data[0]);
        var fields = Object.keys(fieldsNotNested);

        var functionToEvaluate;
        //When the expression is simply a field, use the simple evaluate (works most quickly)
        if (fields.indexOf(dataGrid.props.options.grouping.expr)) {
          functionToEvaluate = getEvalFieldValue;
        } else {
          functionToEvaluate = getEvalExpressionValue;
        }

        //
        //
        /*
        var sortGroupingFn = function(rec1, rec2) {
          var val1 = functionToEvaluate(rec1, expressionToGroup);
          var val2 = functionToEvaluate(rec2, expressionToGroup);
          if (val1 == val2) {
            return 0;
          } else {
            return val1 > val2 ? -1 : 1
          }
        };
        */

        //dataGrid.refs.element.api.sort(sortGroupingFn);
        //dataGrid.props.options.data = $filter('orderBy')(dataGrid.props.options.data, expressionToGroup);

        let resolveNesdedProperty = (path, obj) => {
          return path.split('.').reduce((prev, curr) => {
              return prev ? prev[curr] : undefined
          }, obj || this);
        }

        dataGrid.props.options.data = dataGrid.props.options.data.sort((dataItem1, dataItem2) => {
          let dataItem1Value = resolveNesdedProperty(expressionToGroup, dataItem1);
          let dataItem2Value = resolveNesdedProperty(expressionToGroup, dataItem2);
          if (dataItem1Value < dataItem2Value) return -1;
          if (dataItem1Value > dataItem2Value) return 1;
          return 0;
        })

        //Add a fixed sorter to a group
        dataGrid.props.options.fixedSorters	= [{
          name: expressionToGroup,
          direction: 'ASC'
        }];

        //
        var oldValue;
        var recordGroup;
        var groupIndex = -1;
        for (let index = 0 ; index < dataGrid.props.options.data.length ; index++) {
          var record = dataGrid.props.options.data[index];
          var value = functionToEvaluate(record, expressionToGroup);

          //
          if (oldValue === value) {
            //
            recordGroup.children++;

          //changed value
          } else {
            oldValue = value;
            groupIndex++;
            recordGroup = record;
            recordGroup.children = 1;

            dataGrid.props.options.dataGroup.push(record);
          }

          record.groupIndex = groupIndex;
          record.rowIndex = index;

        }

        //
        dataGrid.bodyContainer.style.height = ((dataGrid.props.options.dataGroup.length * rowHeight) + 2) + 'px';
        if (dataGrid.props.options.fixedCols) {
          dataGrid.fixedColsBodyContainer.height(dataGrid.bodyContainer.clientHeight);
        }
      } else {
        var heightBodyContainer;
        if (dataGrid.props.options.cardView) {
          heightBodyContainer = (Math.ceil(dataGrid.props.options.data.length / dataGrid.props.options.cardView.numberOfColumns) * rowHeight);
        } else {
          heightBodyContainer = (dataGrid.props.options.data.length * rowHeight);
        }

        //
        dataGrid.bodyContainer.style.height = (heightBodyContainer + 2) + 'px';

        if (dataGrid.props.options.fixedCols) {
          dataGrid.fixedColsBodyContainer.style.height = dataGrid.bodyContainer.offsetHeight + 'px';
        }
      }

      //
      dataGrid.managerRendererItems.createItems();

      //
      this._repaint(dataGrid);

      DataGridHelper.remakeHeightBodyViewportWrapper(dataGrid);

      if (dataGrid.props.options.data.length > 0) {
        if (dataGrid.props.options.selType === 'row') {
          dataGrid.refs.element.api.selectRow(0, false, false);
        } else {
          dataGrid.refs.element.api.selectCell(0, 0, false, false);
        }
      }

      ///////////////////////////////////////////////////////////////////////////
      //AfterLoad Event
      ///////////////////////////////////////////////////////////////////////////
      if (dataGrid.props.options.listeners.onafterload) {
        dataGrid.props.options.listeners.onafterload(dataGrid.props.options.data, dataGrid.props.options);
      }
      ///////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////

      if (dataGrid.props.options.paging) {
        this._checkDisableButtonsPageNavigation(dataGrid, data, dataGrid.props.options.paging.currentPage);
      }
    }


    findKey(dataGrid, keyValue, opts) {
      var valuesToFind = JSON.parse('{"' + dataGrid.props.options.keyField + '": "' + keyValue + '"}');
      return this.querySelector(dataGrid, valuesToFind, opts);
    }

    /**
     *
     *
     * @param valuesToFind {object} json which will contains the keys and values for the search
     * @param opts TODO: specify in more details
     *
     * return {array|record} depends on the value of "all" parameter.
     */
     find(dataGrid, valuesToFind, opts) {
      var data = dataGrid.props.options.data || [];
      valuesToFind = valuesToFind || {};
      var keys = Object.keys(valuesToFind);
      if (data.length === 0) {
        throw new Error ('"Find" : There is no data to find!');
      } else if (keys.length === 0) {
        throw new Error ('"Find" : param "valuesToFind" must be informed!');
      }

      ////////////////////////////////////////////////////////////////////////////////
      //get the opt parameter and fill the detault values too
      ////////////////////////////////////////////////////////////////////////////////
      opts = opts || {};
      var exactSearch = (opts.exactSearch === false ? false : true); //Exact search? default = true (only used for string values)
      var all = (opts.all === true ? true : false); //Return all records found? default = false (In this case the search stop when the first record is found)
      var ignoreCase = (opts.ignoreCase === true ? true : false); //Ignore case when comparing strings (only used for string values)
      ////////////////////////////////////////////////////////////////////////////////

      var recordsFound = [];
      var breakParentLoop = false;

      var newJson = DataGridHelper.prepareForNestedJson(valuesToFind);
      keys = Object.keys(newJson);
      ////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////
      var found = false;

      //loop over the data
      for (let index = 0 ; index < data.length ; index++) {
        var record = data[index];

        var foundRecord = false;

        //loop over the fields
        for (var fieldIndex = 0 ; fieldIndex < keys.length ; fieldIndex++) {
          var fieldName = keys[fieldIndex];

          var valueToFind = valuesToFind[fieldName];
          var value = eval('record.' + fieldName); //can be passed address.city
          var valueIsString = Routine.isString(value);
          if (ignoreCase) {
            if (valueIsString) {
              valueToFind = valueToFind.toLowerCase();
              value = value.toLowerCase();
            }
          }

          if ((exactSearch) || (!valueIsString)) {
            foundRecord = valueToFind === value;
          } else {
            foundRecord = value.indexOf(valueToFind) !== -1;
          }

          if (!foundRecord) {
            continue;
          }
        }

        if (foundRecord) { //found record?
          found = true;

          recordsFound.push(record);
          if (!all) {
            break;
          }
        }

      }

      /////////////////////////////////////////////////////////////////////////
      // "inLine" property
      /////////////////////////////////////////////////////////////////////////
      if (found && opts.inLine) {
        /////////////////////////////////////////////////////////////////////////
        // prepare the default values
        /////////////////////////////////////////////////////////////////////////

        // "inLine"
        // default value when its value is iqual true
        var inLineDefaultValue = {
          realce: false
        };
        var inLine;
        if (opts.inLine === true) { //opts.inLine: true
          inLine = inLineDefaultValue;
        } else if (Routine.isObject(opts.inLine)) { //opts.inLine: {...}
          inLine = opts.inLine;
        } else {
          throw new Error('"find": param "inLine" passed in a wrong way');
        }


        // "inLine.realce"
        // default value when its value is iqual true
        var inLineRealceDefaultValue = {
          style: 'background-color:#FFFF00;color:black;padding:1px;'
        };
        var inLineRealce;
        if (inLine.realce) {
          if (inLine.realce === true) { //opts.inLine.realce: true
            inLine.realce = inLineRealceDefaultValue;
          } else { //opts.inLine: {...}
            inLine.realce = opts.inLine.realce;
            inLine.realce.style = inLine.realce.style || inLineRealceDefaultValue.style;
          }
        }

        // "inLine.scrollIntoView"
        inLine.scrollIntoView = (inLine.scrollIntoView === false ? false : true);

        /////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////

        dataGrid.searchInfo = {
          'valuesToFind': valuesToFind,
          'opts': opts
        };

        var selectAndRemoveRendered = function(record, preventSelectionChange, scrollIntoView) {
          dataGrid.refs.element.api.selectRow(record, preventSelectionChange, scrollIntoView);
          var rowElement = dataGrid.refs.element.api.resolveRowElement(record);
          rowElement.setAttribute('rendered', false);
        };

        //remove all selections
        dataGrid.refs.element.api.clearSelections();
        if (Array.isArray(recordsFound)) {
          //multiSelect
          if (dataGrid.props.options.multiSelect) {
            for (let index = 0 ; index < recordsFound.length ; index++) {
              selectAndRemoveRendered(recordsFound[index], index !== 0, index === 0);
            }
          //singleSelect
          } else {
            if (recordsFound.length > 1) {
              console.warn('"find": More than one record was returned, but as the "inLine" property is true and "multiSelect" is false, just the first record will be selected.');
            }
            selectAndRemoveRendered(recordsFound[0], false, true);
          }
        } else {
          if (recordsFound !== null) {
            selectAndRemoveRendered(recordsFound, false, true);
          }
        }


        this._repaint(dataGrid);
      }
      /////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////


      if (all) {
        return recordsFound;
      } else {
        return recordsFound[0];
      }
    }

    /**
     *
     *
     */
     /*
     var _changeFilterInfo = function(filterInfo, valuesToFilter) {
      let keys = Object.keys(valuesToFilter);
      angular.forEach(keys, function(key) {
        filterInfo.valuesToFilter[key] = valuesToFilter[key];
      });
      filterInfo.allFields = false;
     };
     */

    /**
     *
     *
     */
    filter(dataGrid, filterModel, opts) {
      if (Routine.isString(filterModel)) {
        dataGrid.props.options.filter.model = angular.merge(dataGrid.props.options.filter.model, {
          '*': {
            key: filterModel,
            oper: '~',
            value: filterModel
          }
        });
      } else {
        dataGrid.props.options.filter.model = filterModel;
      }

      //always set to first page
      if (dataGrid.props.options.paging) {
        dataGrid.props.options.paging.currentPage = 1;
      }

      //remote filter
      if (dataGrid.props.options.filter && dataGrid.props.options.filter.remote) {
        dataGrid.refs.element.api.reload();

      //local filter
      } else {
        dataGrid.refs.element.api.loadData(dataGrid.props.options.alldata);
      }
    }

    /**
     *
     *
     */
    getRowHeight(dataGrid) {
      return dataGrid.props.options.rowHeight;
    }

    /**
     *
     *
     */
    setRowHeight(dataGrid, rowHeight) {
      var rowElements = dataGrid.bodyViewport.querySelector('div.ui-row:not(.grouping-footer-container)');
      rowElements.style.height = dataGrid.props.options.rowHeight;
    }


    /**
     *
     *
     */
    _recreateAll(dataGrid) {
      if (dataGrid.props.options.data) {
        //Remmove all rows before load
        dataGrid.bodyViewport.querySelector('div.ui-deni-view-group-header').remove();
        dataGrid.bodyViewport.querySelector('div.ui-row').remove();

        this.loadData(dataGrid, dataGrid.props.options.data);
      }
    }

    /**
     *
     *
     */
    toogleGrouping(dataGrid) {
      dataGrid.props.options.enableGrouping = !dataGrid.props.options.enableGrouping;
      _recreateAll(dataGrid);
    }


    /**
     *
     *
     */
    isEnableGrouping(dataGrid) {
      return dataGrid.props.options.enableGrouping;
    }

    /**
     *
     *
     */
    isGrouped(dataGrid) {
      return dataGrid.isGrouped;
    }

    /**
     *
     *
     */
    setEnableGrouping(dataGrid) {
      dataGrid.props.options.enableGrouping = true;
      _recreateAll(dataGrid);
    }

    /**
     *
     *
     */
    setDisableGrouping(dataGrid) {
      dataGrid.props.options.enableGrouping = false;
      _recreateAll(dataGrid);
    }

    //
    //
    //
    //
    /*
    var _renderFixedRowEl = function(dataGrid, itemToRender, record) {
      var fixedRow = $(document.createElement('div'));
      fixedRow.classList.add('ui-fixed-row');
      fixedRow.setAttribute('rowindex', itemToRender.rowIndex.toString());
      fixedRow.css('left', '0px');
      fixedRow.css('top', itemToRender.top + 'px');
      fixedRow.css('height', itemToRender.height + 'px');
      //.html(itemToRender.rowIndex.toString());
      dataGrid.fixedColsBodyContainer.append(fixedRow);
    }
    */

    //
    //
    //
    //
    _renderRowEl(dataGrid, itemToRender, record) {

      let rowElement = document.createElement('div');
      rowElement.classList.add('ui-row');
      rowElement.setAttribute('rowindex', itemToRender.rowIndex.toString());
      rowElement.style.left = '0px';

      let fixedRowElement;
      if (dataGrid.props.options.fixedCols) {
        fixedRowElement = document.createElement('div');
        fixedRowElement.classList.add('ui-row');
        fixedRowElement.setAttribute('rowindex', itemToRender.rowIndex.toString());
        fixedRowElement.style.left = '0px';
        dataGrid.fixedColsBodyContainer.append(fixedRowElement);
      }

      //ROW DETAIL
      if (itemToRender.rowDetails) {
        let rowElementParent = dataGrid.bodyContainer.querySelector('.ui-row[rowIndex=' + itemToRender.rowIndex + ']:not(.row-detail-container)');
        rowElement.insertAfter(rowElementParent);

        let isSelected = rowElementParent.querySelector('.ui-cell:eq(0)').classList.contains('selected');
        if (isSelected) {
          rowElement.classList.add('selected');
        }
        rowElement.classList.add('row-detail-container');

        let rowDetailsBox = $(document.createElement('div'));
        rowDetailsBox.classList.add('row-detail-box');
        rowElement.append(rowDetailsBox);

        rowElementParent = dataGrid.refs.element.api.resolveRowElement(itemToRender.rowIndex);

        rowElement.style.height = itemToRender.height + 'px';
        rowElement.style.top = itemToRender.top + 'px';
        rowElement.insertAfter(rowElementParent);

        rowElement.click(function() {
          dataGrid.refs.element.api.selectRow(rowElementParent);
        });

        itemToRender.rowElement = rowElement;


        if (dataGrid.props.options.rowDetails.template) {
          let valueToRender = DataGridHelper.applyTemplateValues(dataGrid.props.options.rowDetails.template, record);
          itemToRender.rowElement.innerHTML = valueToRender;
        } else if (dataGrid.props.options.rowDetails.renderer)	{
          dataGrid.props.options.rowDetails.renderer(itemToRender.rowElements, record);
        }
      } else {
        dataGrid.bodyContainer.append(rowElement);

        rowElement.style.height = itemToRender.height + 'px';
        rowElement.style.top = itemToRender.top + 'px';
        if (dataGrid.props.options.fixedCols) {
          fixedRowElement.style.height = itemToRender.height + 'px';
          fixedRowElement.style.top = itemToRender.top + 'px';
        }

        // GROUPING	OR GROUPING	FOOTER
        if (Routine.isDefined(itemToRender.children)) {

          //GROUPING FOOTER
          if (itemToRender.footerContainer) {
            rowElement.classList.add('ui-grouping-footer-container');

          //GROUP
          } else {
            rowElement.classList.add('row-detail');
            rowElement.classList.add('grouping'); //added basically to not select this line

            if (itemToRender.expanded) {
              rowElement.classList.add('collapse');
            } else {
              rowElement.classList.add('expand');
            }

          }

          //
          rowElement.setAttribute('groupIndex', itemToRender.groupIndex);
          rowElement.setAttribute('children', itemToRender.children);

        } else {
          // GROUP CHILD
          if (Routine.isDefined(itemToRender.groupIndex)) {
            rowElement.setAttribute('groupIndex', itemToRender.groupIndex);
            rowElement.setAttribute('indexInsideGroup', itemToRender.indexInsideGroup);

            // stripRows (odd line?)
            if (dataGrid.props.options.stripRows) {
              if (itemToRender.indexInsideGroup % 2 === 1) {
                rowElement.classList.add('odd-row');
              }
            }

          // common row
          } else {
            /*
            if (dataGrid.props.options.rowDetails) {
              if (itemToRender.expanded) {
                rowElement.classList.add('collapse');
              } else {
                rowElement.classList.add('expand');
              }
            }
            */

            // stripRows (odd line?)
            if (dataGrid.props.options.stripRows) {
              if (itemToRender.rowIndex % 2 === 1) {
                rowElement.classList.add('odd-row');
                if (dataGrid.props.options.fixedCols) {
                  fixedRowElement.classList.add('odd-row');
                }
              }
            }
          }
        }
      }



      ///////////////////////////////////////////////
      // onbeforerender event
      ///////////////////////////////////////////////
      if (dataGrid.props.options.listeners.onbeforerender) {
        dataGrid.props.options.listeners.onbeforerender(rowElement, dataGrid);
      }
      ///////////////////////////////////////////////
      ///////////////////////////////////////////////

      this.deniGridEventService.onrenderer(rowElement, fixedRowElement, record, itemToRender);

      ///////////////////////////////////////////////
      // onafterrender event
      ////////////////////////////////////////////////////////////////
      if (dataGrid.props.options.listeners.onafterrender) {
        dataGrid.props.options.listeners.onafterrender(rowElement, dataGrid);
      }
      ///////////////////////////////////////////////
      ///////////////////////////////////////////////

      ////////////////////////////////////////////////////
      //ondblclick event
      ////////////////////////////////////////////////////
      rowElement.addEventListener('dblclick', event => {
          var targetEl = $(event.target);
          var rowElementDblClick = Routine.getClosest(targetEl, '.ui-row');
        var rowIndexDblClick = parseInt(rowElementDblClick.setAttribute('rowindex'));
        var recordDblClick = dataGrid.props.options.data[rowIndexDblClick];
        if (dataGrid.props.options.listeners.onrowdblclick) {
          dataGrid.props.options.listeners.onrowdblclick(recordDblClick, rowElementDblClick, rowIndexDblClick);
        }
      });
      ////////////////////////////////////////////////////
      ////////////////////////////////////////////////////

      itemToRender.rendered = true;
      return rowElement;
    }

    /**
     * forceRepaint force repaint all visible rows
     *
     */
    repaint(dataGrid, forceRepaint) {
      this._repaint(dataGrid, forceRepaint);
    }

    /**
     *
     *
     */
    repaintRow(dataGrid, row) {
      var rowIndex = dataGrid.refs.element.api.resolveRowIndex(row);
      this._repaintRow(dataGrid, rowIndex, true, true);
    }

    /**
     *
     *
     */
    repaintSelectedRow(dataGrid) {
      var selectedRowIndex = this.getSelectedRowIndex(dataGrid);
      this.repaintRow(dataGrid, selectedRowIndex);
    }


    /**
     *
     *
     */
    getRowIndex(dataGrid, record) {
      var data = dataGrid.props.options.data;
      for (let index = 0 ; index < data.length ; index++) {
        var rec = data[index];
        //if (angular.equals(rec, record)) {
        if (record === rec) {
          return index;
        }
      }
      return -1;
    }

    /**
     *
     *
     */
    removeRow(dataGrid, row) {
      var rowIndexToDelete = dataGrid.refs.element.api.resolveRowIndex(row);
      var currentRowIndex = dataGrid.refs.element.api.getSelectedRowIndex();
      var deletingCurrentRow = rowIndexToDelete === currentRowIndex;

      dataGrid.managerRendererItems.removeRow(dataGrid, rowIndexToDelete);
      this._repaint(dataGrid);

      // try to restore stat of selelction
      if (dataGrid.props.options.data.length > 0) {
        if (currentRowIndex !== -1) {
          var rowIndexToSelect = currentRowIndex;
          if (rowIndexToSelect > rowIndexToDelete) {
            rowIndexToSelect--;
          }
          dataGrid.refs.element.api.selectRow(rowIndexToSelect, false, false);
        }
      }
    }

    /**
     *
     *
     */
    removeSelectedRows(dataGrid) {
      var selectedRowIndexes = this.getSelectedRowIndexes(dataGrid);
      var decreaseRowIndex = 0;
      for (let index = 0 ; index < selectedRowIndexes.length ; index++) {
        var rowIndex = selectedRowIndexes[index];
        this.removeRow(dataGrid, rowIndex - decreaseRowIndex);
        decreaseRowIndex++;
      }
    }

    // This function help some other functions which get row parameter where sometimes
    // it comes like a record object and sometimes comes its rowIndex
    //
    // row {Number|Object|JQueryElement} Can be passed rowIndex, the object record or even the JQueryElement which corresponds to the object record
    // returns the JQuery Element which corresponds to the object record
    resolveRowElement(dataGrid, row) {
      var rowIndex = -1;
      if (Routine.isObject(row)) {  //passed the object record or the DOM element
        if (Routine.isElement(row)) { //passed JQuery element
          return row;
        } else { //passed record object
          rowIndex = this.getRowIndex(dataGrid, row);
        }
      } else { //passed rowIndex
        rowIndex = row;
      }

      //don't select grouping rows
      return dataGrid.bodyViewport.querySelector('.ui-row[rowindex="' + rowIndex + '"]:not(.grouping)');
    }

    // This function help some other functions which get row parameter where sometimes
    // it comes like a record object and sometimes comes its rowIndex
    //
    // row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
    // returns the row index
    resolveRowIndex(dataGrid, row) {
      if (Routine.isObject(row)) {  //passed the object record or the DOM element
        if (Routine.isElement(row)) { //passed DOM element
          return row.setAttribute('rowindex');
        } else { //passed record object
          return this.getRowIndex(dataGrid, row);
        }
      } else { //passed rowIndex
        return row;
      }
    }

    setEnabled(dataGrid, enabled) {
      dataGrid.enabled = enabled;

      if (enabled) {
        dataGrid.refs.element.classList.remove('disabled');
      } else {
        dataGrid.refs.element.classList.add('disabled');
      }
    }

    hasColumnFooter(dataGrid) {
			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (dataGrid.props.options.columns) {
				var columns = dataGrid.props.options.columns;
				for (var index = 0; index < columns.length; index++) {
					if (columns[index].footer) {
						return true;
					}
				}
			}

			return false;
		};


  }



export default DataGridService;
