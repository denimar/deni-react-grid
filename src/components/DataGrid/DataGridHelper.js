import Constant from '../../util/Constant';
import Routine from '../../util/Routine';

class DataGridHelper {

  static setDefaultOptions(dataGrid, options) {
    var opt = {};

  			/**
  			 *
  			 *
  			 *
  			 */
  			opt.api = {};

  			/**
  			 *
  			 *
  			 *
  			 */
  			opt.listeners = {};

  			/**
  			 *
  			 * 'cell' or 'row' (default = 'row')
  			 *
  			 *
  			 */
  	        opt.selType = 'row';

  			/**
  			 *
  			 * (default = true)
  			 *
  			 *
  			 */
  	        opt.colLines = true;

  			/**
  			 *
  			 * (default = true)
  			 *
  			 *
  			 */
  	        opt.rowLines = true;

  			/**
  			 * @opt {Boolean} [autoLoad=true]
  			 *
  			 */
  			opt.autoLoad = true;

  			/**
  			 * @opt {String} [columnHeaderHeight='25px']
  			 *
  			 */
  			opt.columnHeaderHeight = Constant.DEFAULT_COLUMN_HEADER_HEIGHT;


  			/**
  			 * @opt {String} [columnFooterRowHeight='22px']
  			 *
  			 */
  			opt.columnFooterRowHeight = Constant.DEFAULT_COLUMN_ROW_FOOTER_HEIGHT;

  			/**
  			 * @opt {String} [columnGroupingFooterRowHeight='18px']
  			 *
  			 */
  			opt.columnGroupingFooterRowHeight = Constant.DEFAULT_COLUMN_GROUPING_ROW_FOOTER_HEIGHT;

  			/**
  			 * @opt {Boolean} [enableGrouping=true]
  			 *
  			 */
  			opt.enableGrouping = true;

  			/**
  			 * @opt {Boolean} [enableColumnResize=true]
  			 *
  			 */
  			opt.enableColumnResize = true;

  			/**
  			 * @opt {Object}
  			 *
  			 */
  			opt.filter = Constant.DEFAULT_FILTER_OPTIONS;

  			/**
  			 * @opt {Boolean} [hideHeader=false]
  			 *
  			 */
  			opt.hideHeaders = false;

  			/**
  			 * @opt {String} [rowHeight='22px']
  			 *
  			 */
  			opt.rowHeight = Constant.DEFAULT_ROW_HEIGHT;

  			/**
  			 * @opt {Boolean} [multiSelect=false]
  			 *
  			 */
  			opt.multiSelect = false;

  			/**
  			 * @opt {Boolean} [sortableColumns=true]
  			 *
  			 */
  			opt.sortableColumns = dataGrid.props.options.rowDetails ? false : true;


  		    /**
  		     * @opt {Array|Object|String} [sorters=null]
  			 *
  			 * 	It is a very flexible config and might be filled this way
  			 *
  			 * 	(string):
  			 *
  			 *		'city' or even
  			 *
  			 *	or (json):
  			 *
  			 * 		{name: 'city', direction: 'ASC'} or
  			 *
  			 *	or (function):
  			 *
  			 *		function(rec1, rec2) {
  			 *			if (rec1.age == rec2.age) return 0;
  			 *			return rec1.age < rec2.age ? -1 : 1;
  			 *		});
  			 *
  			 *	or even (array):
  			 *
  			 * 		[
  			 *			'city',
  			 *			{name: 'age', direction: 'DESC'},
  			 *			function(rec1, rec2) {
  			 *				if (rec1.age == rec2.age) return 0;
  			 *				return rec1.age < rec2.age ? -1 : 1;
  			 *			}
  			 *		]
  			 *
  			 */
  			opt.sorters = [];

  			/**
  			 * @opt {Boolean} [stropRows=true]
  			 *
  			 *
  			 */
  			opt.stripRows = true;


  			//
        Object.assign(opt, dataGrid.props.options);
  			Object.assign(dataGrid.props.options, opt);


  			/**
  			 * @opt {Boolean} [hideHeaders=false]
  			 *
  			 *
  			 * when there is rowTemplate it also don't has column headers
  			 *
  			 */
  			dataGrid.props.options.hideHeaders = (dataGrid.props.options.hideHeaders === true) || (Routine.isDefined(dataGrid.props.options.rowTemplate)) || (Routine.isDefined(dataGrid.props.options.cardView));

  			//CardView
  			if (dataGrid.props.options.cardView) {
  				dataGrid.props.options.rowHeight = dataGrid.props.options.cardView.rowHeight || '150px';
  			}
  			//Avoid a error when is passed a integer value
  			dataGrid.props.options.rowHeight = dataGrid.props.options.rowHeight.toString();


  			/////////////////////////////////////////////////////
  			// Setting default values to the grouping
  			/////////////////////////////////////////////////////
  			dataGrid.isGrouped = (dataGrid.props.options.enableGrouping && Routine.isDefined(dataGrid.props.options.grouping));
  			if (dataGrid.isGrouped) {

  				//grouping passed like a string
  				if (Routine.isString(dataGrid.props.options.grouping)) {
  					dataGrid.props.options.grouping = {
  						expr: dataGrid.props.options.grouping
  					};
  				}

  				//
  				if (!((Routine.isObject(dataGrid.props.options.grouping)) && (!(Routine.isArray(dataGrid.props.options.grouping))))) {
  					throw new Error('"loadData": param "grouping" passed in a wrong way');
  				}

  				//
  				var defaultTemplate = '<b>{' + dataGrid.props.options.grouping.expr + '}</b> ({count})';
  				//
  				dataGrid.props.options.grouping.template = dataGrid.props.options.grouping.template || defaultTemplate;
  			}
  			/////////////////////////////////////////////////////


  			////////////////////////////////////////////////////////////////////////////////////////
  			// fixedCols
  			////////////////////////////////////////////////////////////////////////////////////////
  			if (dataGrid.props.options.fixedCols) {

  				//
  				var getFixedColsWidth = function(fixedColumns) {
  					var fixedColsWidth = 0;
  					//
  					if (dataGrid.props.options.fixedCols.indicator) {
  						fixedColsWidth += parseFloat(Constant.FIXED_COL_INDICATOR_WIDTH.replace('px', ''));
  					}
  					//
  					if (dataGrid.props.options.fixedCols.rowNumber) {
  						fixedColsWidth += parseFloat(Constant.FIXED_COL_ROWNUMBER_WIDTH.replace('px', ''));
  					}
  					//
  					if (dataGrid.props.options.fixedCols.checkbox) {
  						fixedColsWidth += parseFloat(Constant.FIXED_COL_CHECKBOX_WIDTH.replace('px', ''));
  					}

  					//
  					if (dataGrid.props.options.fixedCols.columns) {
  						for (let index = 0 ; index < fixedColumns.length ; index++) {
  							fixedColsWidth += parseFloat(me.getRealColumnWidth(this, fixedColumns[index].width).replace('px', ''));
  						}
  					}

  					return fixedColsWidth;
  				};


  				//fixedCols filled just with 'true'
  				if (dataGrid.props.options.fixedCols === true) {
  					dataGrid.props.options.fixedCols = {
  						indicator: true
  					};
  				}

  				//fixedCols.indicator filled different of 'true' (MUST BE A BOOLEAN VALUE)
  				if ((Routine.isDefined(dataGrid.props.options.fixedCols.indicator)) && (dataGrid.props.options.fixedCols.indicator !== true) && (dataGrid.props.options.fixedCols.indicator !== false)) {
  					throw new Error('"setInitialDefaultOptions" : "fixedCols.indicator" property was set in a wrong way! (it must be a boolean value)');
  				}

  				//fixedCols.rowNumber filled different of 'true' (MUST BE A BOOLEAN VALUE)
  				if ((Routine.isDefined(dataGrid.props.options.fixedCols.rowNumber)) && (dataGrid.props.options.fixedCols.rowNumber !== true) && (dataGrid.props.options.fixedCols.rowNumber !== false)) {
  					throw new Error('"setInitialDefaultOptions" : "fixedCols.rowNumber" property was set in a wrong way! (it must be a boolean value)');
  				}

  				//fixedCols.checkbox filled different of 'true' (MUST BE A BOOLEAN VALUE)
  				if ((Routine.isDefined(dataGrid.props.options.fixedCols.checkbox)) && (dataGrid.props.options.fixedCols.checkbox !== true) && (dataGrid.props.options.fixedCols.checkbox !== false)) {
  					throw new Error('"setInitialDefaultOptions" : "fixedCols.checkbox" property was set in a wrong way! (it must be a boolean value)');
  				}

  				//Are there columns in the fixed colums?
  				var fixedColumns = dataGrid.props.options.fixedCols.columns;
  				if (fixedColumns) {
  					if (Routine.isArray(fixedColumns)) {
  						for (let index = 0 ; index < fixedColumns.length ; index++) {

  							//confirms the existence of the column
  							var found = false;
  							for (var fieldIndex = 0 ; fieldIndex < dataGrid.props.options.columns.length ; fieldIndex++) {
  								var field = dataGrid.props.options.columns[fieldIndex];

  								if (field.name === fixedColumns[index]) {
  									fixedColumns[index] = field;
  									found = true;
  									break;
  								}
  							}
  							if (!found) {
  								throw new Error('"setInitialDefaultOptions" : "fixedCols.columns" -> column "' + fixedColumns[index] + '" not found!');
  							}

  						}
  					} else {
  						throw new Error('"setInitialDefaultOptions" : "fixedCols.columns" property was set in a wrong way!');
  					}
  				}

  				dataGrid.props.options.fixedCols.width = getFixedColsWidth(fixedColumns);
  			}
  			////////////////////////////////////////////////////////////////////////////////////////
  			////////////////////////////////////////////////////////////////////////////////////////

  			//Paging
  			if (dataGrid.props.options.paging) {
  				if (dataGrid.props.options.paging === true) {
  					dataGrid.props.options.paging = {};
  				}

  				dataGrid.props.options.paging.type = dataGrid.props.options.paging.type || 'json';
  				dataGrid.props.options.paging.pageSize = dataGrid.props.options.paging.pageSize || 50;
  				dataGrid.props.options.paging.currentPage = dataGrid.props.options.paging.currentPage || 1;
  			}

  			////////////////////////////////////////////////////////////////////////////////////////
  			//restConfig
  			////////////////////////////////////////////////////////////////////////////////////////
  			var restConfig = dataGrid.props.options.restConfig;
  			var restConfigDefaults = {
  				type: 'json',
  				data: 'data',
  				total: 'total',
  				start: 'start',
  				limit: 'limit'
  			};

  			if (restConfig) {
  				Object.assign(restConfigDefaults, restConfig);
  			} else {
  				restConfig = restConfigDefaults;
  			}
  			dataGrid.props.options.restConfig = restConfig;
  			////////////////////////////////////////////////////////////////////////////////////////
  			////////////////////////////////////////////////////////////////////////////////////////
  }

  static ckeckInitialValueFilter(dataGrid, columns) {
    //angular.forEach(columns, function(column) {
    columns.forEach(column => {
				if ((column.filter) && (column.filter.initialValue)) {
					let initialValue = column.filter.initialValue;

					if (this.isFunction(initialValue)) {
						initialValue = initialValue();
					}

					let value = {};

					//integer
					if (column.filter.type === 'integer') {
						//TODO: missing implementation

					//float
					} else if (column.filter.type === 'float') {
						//TODO: missing implementation

					//string
					} else if (column.filter.type === 'string') {
						value = {
							key: initialValue.toString(),
							value: initialValue.toString(),
							oper: '~'
						};

					//date
					} else if (column.filter.type === 'date') {
						//TODO: missing implementation

					//date and time
					} else if (column.filter.type === 'datetime') {
						//Transform the initValue in a array
						let initialValueArray = initialValue;
						if (!angular.isArray(initialValueArray)) {
							initialValueArray = [initialValue];
						}

						value = [];

						if (initialValueArray.length > 0) {
							//<=
							value.push({
								key: initialValueArray[0],
								value: initialValueArray[0],
								oper: '<='
							});
						}

						if (initialValueArray.length > 1) {
							//>=
							value.push({
								key: initialValueArray[1],
								value: initialValueArray[1],
								oper: '>='
							});
						}


					//boolean
					} else if (column.filter.type === 'boolean') {
						//TODO: missing implementation

					//select (radio)
					} else if (column.filter.type === 'select') {
						//TODO: missing implementation

					//multi select (checkbox)
					} else if (column.filter.type === 'multiSelect') {
						//Transform the initValue in a array
						let initialValueArray = initialValue;
						if (!angular.isArray(initialValueArray)) {
							initialValueArray = [initialValue];
						}

						value = [];
						//angular.forEach(initialValueArray, function (initialValueArrayItem) {
            initialValueArray.forEach(initialValueArrayItem => {
							value.push({
								key: initialValueArrayItem,
								value: initialValueArrayItem,
								oper: '='
							});
						});

						//
					} else {
						throw new Error('Filter type invalid!');
					}

					dataGrid.props.options.filter.model[column.filter.field || column.name] = value;
				}
			});
  }

  /**
   *
   *
   */
  static getClientWidthDeniGrid(dataGrid) {

    //
    let scroolBarWidth = dataGrid.bodyViewport.offsetWidth - dataGrid.bodyViewport.clientWidth;
    //
    let containerWidth = dataGrid.colsContainer.clientWidth - scroolBarWidth;

    return containerWidth;
  }

  /**
   *
   *
   */
  static getColumnHeaderLevels(dataGrid, columns) {
    var greaterLevelChild = 0;
    var levelsChild = 0;
    for (let index = 0 ; index < columns.length ; index++) {
      var column = columns[index];
      //
      if (column.columns) {
        //
        levelsChild = this.getColumnHeaderLevels(dataGrid, column.columns);

        if (levelsChild > greaterLevelChild) {
          greaterLevelChild = levelsChild;
        }
      }
    }


    return 1 + greaterLevelChild;
  }


	/**
	 * realPercentageWidth cause effect only when there are more then one level of columns
	 */
	static setRealPercentageWidths(columns, percentageMaster) {
		var percentageMasterValue = parseFloat(percentageMaster.replace('%', ''));
		for (let index = 0 ; index < columns.length ; index++) {
			if (percentageMaster !== '100%') {
				var percentageWidthValue = parseFloat(columns[index].width.replace('%', ''));
				columns[index].realPercentageWidth = (percentageMasterValue * percentageWidthValue / 100) + '%';
			}
			var columnChildren = columns[index].columns;
			if ((columnChildren) && (columnChildren.length > 0)) {
				this.setRealPercentageWidths(columnChildren, columns[index].width);
			}
		}
	}



	/**
	 *
	 *
	 */
	static isFixedColumn(dataGrid, columnName) {
		if ((dataGrid.props.options.fixedCols) && (dataGrid.props.options.fixedCols.columns)) {
			for (let index = 0 ; index < dataGrid.props.options.fixedCols.columns.length ; index++) {
				if (dataGrid.props.options.fixedCols.columns[index].name === columnName) {
					return true;
				}
			}
		} else {
			return false;
		}
	}

  /**
   * It is not the same as getColumnFooterNumber
   *
   */
  static getColumnFooterRowsNumber(dataGrid, groupingFooter) {

  	//How many footers?
  	var columnFooterRowsNumber = 0;

  	//this if exists because sometimes there is no need for columns, for example when there is a row template
  	if (dataGrid.props.options.columns) {
  		for (let index = 0 ; index < dataGrid.props.options.columns.length ; index++) {
  			var column = dataGrid.props.options.columns[index];
  			//
  			if (column.footer) {
  				var lenght = 1;
  				//
  				if (angular.isArray(column.footer)) {
  					lenght = 0;
  					for (var colIndex = 0 ; colIndex < column.footer.length ; colIndex++) {
  						var footer = column.footer[colIndex];
  						//
  						if (Routine.isObject(footer)) {
  							//
  							if (groupingFooter) {
  								//
  								if (footer.grouping !== false) {
  									lenght++;
  								}
  							//
  							} else {
  								//
  								if (footer.grid !== false) {
  									lenght++;
  								}
  							}
  						//
  						} else {
  							lenght++;
  						}
  					}
  				}
  				//
  				if (lenght > columnFooterRowsNumber) {
  					columnFooterRowsNumber = lenght;
  				}
  			}
  		}
  	}

  	return columnFooterRowsNumber;
  }

  /**
	 *	It is not the same as getColumnFooterRowsNumber
	 *
	 */
	static getColumnFooterNumber(dataGrid) {

		//How many footers?
		var columnFooterNumber = 0;

		//this if exists because sometimes there is no need for columns, for example when there is a row template
		if (dataGrid.props.options.columns) {
			for (let index = 0 ; index < dataGrid.props.options.columns.length ; index++) {
				var column = dataGrid.props.options.columns[index];
				//
				if (column.footer) {
					var lenght = Routine.isArray(column.footer) ? column.footer.length : 1;
					//
					if (lenght > columnFooterNumber) {
						columnFooterNumber = lenght;
					}
				}
			}
		}

		return columnFooterNumber;

	}

  /**
   *
   *
   */
  static hasColumnFooter(dataGrid) {

    //this if exists because sometimes there is no need for columns, for example when there is a row template
    if (dataGrid.props.options.columns) {
      var columns = dataGrid.props.options.columns;
      for (let index = 0 ; index < columns.length ; index++) {
        if (columns[index].footer) {
          return true;
        }
      }
    }

    return false;
  }

  /**
	 *
	 *
	 */
	static remakeHeightBodyViewportWrapper(dataGrid) {
		var paddingfooterDivContainerWidth = 3;

		var otherDivsheight = 0;

		//Showing column header?
		if (dataGrid.headerViewportWrapper.style.display !== 'none') {
			otherDivsheight += dataGrid.headerViewportWrapper.clientHeight;
		}

		//Paging?
		if (dataGrid.props.options.paging) {
			dataGrid.container.style.height = 'calc(100% - ' +  Constant.PAGING_HEIGHT + ')';
		}

		//Showing footer?
		if (dataGrid.footerViewportWrapper.style.display !== 'none') {
			otherDivsheight += dataGrid.footerViewportWrapper.height() + paddingfooterDivContainerWidth;
		}

		var viewMainDivHeight = 'calc(100% - ' + otherDivsheight + 'px)';
		dataGrid.bodyViewportWrapper.style.height = viewMainDivHeight;
	};

  /**
   *	Usage:  getColumns(dataGrid, dataGrid.props.options.columns)
   *
  */
  static getColumns(dataGrid, sourceColumns) {
    var columns = [];
    for (let index = 0 ; index < sourceColumns.length ; index++) {
      var column = sourceColumns[index];

      //
      if (column.columns) {
        columns = columns.concat(this.getColumns(dataGrid, column.columns));
      } else {
        columns.push(column);
      }
    }

    return columns;
  }

  /**
	 *
	 *
	 */
	static adjustAllColumnWidtsAccordingColumnHeader(dataGrid) {
		if (Routine.isDefined(dataGrid.props.options.columns)) {
			let columns = DataGridHelper.getColumns(dataGrid, dataGrid.props.options.columns);
			//Any column was specified in percentage? TODO: create a function to get this
			let anyColumnInPercentage = false;
			for (let colIndex = 0 ; colIndex < dataGrid.props.options.columns.length ; colIndex++) {
				if (dataGrid.props.options.columns[colIndex].width.toString().indexOf('%') !== -1) {
					anyColumnInPercentage = true;
					break;
				}
			}
			if (anyColumnInPercentage) {
				//dataGrid.bodyContainer.find('.ui-row').css('width', '100%');
			}
		}

		let colIndex = 0;

		//Fixed Columns
		let headerContainerColumns = dataGrid.fixedColsHeaderContainer.querySelectorAll('.ui-header-container-column:not(.has-subcolumns)');
		for (let index = 0 ; index < headerContainerColumns.length ; index++) {
			let headerContainerColumn = headerContainerColumns[index];
			DataGridHelper.adjustColumnWidtsAccordingColumnHeader(dataGrid, headerContainerColumn, colIndex);
			colIndex++;
		}

		//Variable Columns
		headerContainerColumns = dataGrid.headerContainer.querySelectorAll('.ui-header-container-column:not(.has-subcolumns)');
		for (let i = 0 ; i < headerContainerColumns.length ; i++) {
			let headerContainerColumn = headerContainerColumns[i];
			DataGridHelper.adjustColumnWidtsAccordingColumnHeader(dataGrid, headerContainerColumn, colIndex);
			colIndex++;
		}
	}

  /**
	 *
	 *
	 */
   static adjustColumnWidtsAccordingColumnHeader(dataGrid, headerContainerColumn, colIndex) {
     var headerContainer = Routine.getClosest(headerContainerColumn, '.ui-header-container');
     var bodyContainer = Routine.getClosest(headerContainerColumn, '.ui-container').querySelector('.ui-body-container');

     //Refresh deniview widths
     //bodyContainer.find('.ui-row').css('width', headerContainer.css('width'));
     //bodyContainer.find('.ui-row:not(.row-detail)').css('width', headerContainer.css('width'));
     //
     var newWidth = headerContainerColumn.offsetWidth + 'px';
     if (headerContainerColumn.classList.contains('ui-header-container-column.last-subcolumn')) {
       //plus border width
       newWidth = 'calc(' + newWidth + ' + 2px)';
     }
     var columns = bodyContainer.querySelectorAll('.ui-cell[colindex="' + colIndex + '"]');
     columns.forEach(column => {
       column.style.width = newWidth;
     });

     //
     if (dataGrid.props.options.data.length > 0) {
       //var firstRowCells = bodyContainer.find('.ui-row:eq(0)').find('.ui-cell');
       //var lastCellInTheFirstRow = firstRowCells[firstRowCells.length - 1];
       //bodyContainer.width(lastCellInTheFirstRow.offsetLeft + lastCellInTheFirstRow.offsetWidth);
       bodyContainer.style.width = headerContainer.style.width;
     }
   }

   static createPagingItems(dataGrid, paging, pagingOptions) {
			//First Page Button
			var buttonFirst = document.createElement('span');
			buttonFirst.classList.add('button');
			buttonFirst.classList.add('button-first');
			buttonFirst.classList.add('disabled');
      paging.appendChild(buttonFirst);
      buttonFirst.addEventListener('click', () => {
        dataGrid.element.api.setPageNumber(1);
      });

			//Previous Page Button
			var buttonPrev = document.createElement('span');
			buttonPrev.classList.add('button');
			buttonPrev.classList.add('button-prev');
			buttonPrev.classList.add('disabled');
			paging.appendChild(buttonPrev);
      buttonPrev.addEventListener('click', () => {
        dataGrid.element.api.setPageNumber(dataGrid.element.api.getPageNumber() - 1);
      });

			//
			var separator1 = document.createElement('span');
			separator1.classList.add('separator');
			paging.appendChild(separator1);

			//
			var labelPageNumber = document.createElement('span');
			labelPageNumber.classList.add('label-page-number');
			labelPageNumber.innerHTML = 'Page';
			paging.appendChild(labelPageNumber);

			//
			var inputPageNumber = document.createElement('input');
			inputPageNumber.classList.add('input-page-number');
			inputPageNumber.setAttribute('type', 'text');
			inputPageNumber.setAttribute('value', dataGrid.props.options.paging.currentPage);
			paging.appendChild(inputPageNumber);
      inputPageNumber.addEventListener('keydown', (event) => {
      	if (event.keyCode === 13) { //Return
					let pageNumber = parseInt(event.target.value);
					if (pageNumber < 1) {
						pageNumber = 1;
					} else if (pageNumber > dataGrid.props.options.paging.pageCount) {
						pageNumber = dataGrid.props.options.paging.pageCount;
					}
					dataGrid.element.api.setPageNumber(pageNumber);
					inputPageNumber.focus();
          inputPageNumber.setSelectionRange(0, inputPageNumber.value.length);
				}
      });
      inputPageNumber.addEventListener('focus', (event) => {
        inputPageNumber.setSelectionRange(0, inputPageNumber.value.length);
      });

			//
			var labelPageCount = document.createElement('span');
			labelPageCount.classList.add('label-page-count');
			//labelPageCount.html('of 156');
			paging.appendChild(labelPageCount);

			//
			var separator2 = document.createElement('span');
			separator2.classList.add('separator');
			paging.appendChild(separator2);

			//Next Page Button
			var buttonNext = document.createElement('span');
			buttonNext.classList.add('button');
			buttonNext.classList.add('button-next');
			buttonNext.classList.add('disabled');
			paging.appendChild(buttonNext);
      buttonNext.addEventListener('click', () => {
        dataGrid.element.api.setPageNumber(dataGrid.element.api.getPageNumber() + 1);
      });

			//
			var buttonLast = document.createElement('span');
			buttonLast.classList.add('button');
			buttonLast.classList.add('button-last');
			buttonLast.classList.add('disabled');
			paging.appendChild(buttonLast);
      buttonLast.addEventListener('click', () => {
        dataGrid.element.api.setPageNumber(dataGrid.props.options.paging.pageCount);
      });

			//
			var separator3 = document.createElement('span');
			separator3.classList.add('separator');
			paging.appendChild(separator3);

			//
			var refreshButton = document.createElement('span');
			refreshButton.classList.add('button');
			refreshButton.classList.add('button-refresh');
			paging.appendChild(refreshButton);
      refreshButton.addEventListener('click', () => {
        dataGrid.element.api.reload();
      });

			//
			var labelRecordCount = document.createElement('span');
			labelRecordCount.classList.add('label-record-count');
			//labelRecordCount.html('654 records');
			paging.appendChild(labelRecordCount);

			//
			var separator5 = document.createElement('span');
			separator5.classList.add('separator');
			separator5.style.float = 'right';
			paging.appendChild(separator5);

			//
			var labelDisplaying = document.createElement('span');
			labelDisplaying.classList.add('label-displaying');
			//labelDisplaying.html('Displaying records 51 - 100 of 6679');
			paging.appendChild(labelDisplaying);


			//Additional buttons
			if (Routine.isDefined(pagingOptions.buttons)) {
				if (Routine.isArray(pagingOptions.buttons)) {
					var separator4 = document.createElement('span');
					separator4.classList.add('separator');
					separator4.style.float = 'right';
					separator4.style.marginLeft = '4px';

					paging.appendChild(separator4);

					pagingOptions.buttons.forEach(buttonConfig => {
						//
						var additionalButton = document.createElement('span');
						additionalButton.classList.add('button');
						additionalButton.classList.add('button-additional');
						additionalButton.classList.add('disabled');
						additionalButton.innerHTML = buttonConfig.text;
						paging.appendChild(additionalButton);
						//additionalButton.get(0).onclick = buttonConfig.click;
					});
				} else {
					console.log('"buttons" property must be a array.');
				}
			}

			// //
			// paging.find('.button').mouseenter(function(event) {
			// 	$(event.target).classList.add('hover');
			// });
      //
			// //
			// paging.find('.button').mouseout(function(event) {
			// 	$(event.target).removeClass('hover');
			// });

		}

    /*
		 *  Validas Formats:
		 *
		 *		-currency: Format a number to a currency format.
		 *		-date: Format a date to a specified format.
		 *		-int or integer: Trunc a float number to show only its integer value.
		 *		-float: Like currency, but without dollar sign
	 	 *		-lowercase: Format a string to lower case.
	 	 *		-uppercase: Format a string to upper case.
		 */
		static getFormatedValue(value, format) {
			let lowerFormat = format.toLowerCase();

			switch (lowerFormat) {

				case 'currency':
					//return $filter(lowerFormat)(value);
          return value;

				case 'date':
					//return $filter(lowerFormat)(value, 'shortDate');
          return value;

				case 'float':
					return $filter('currency')(value, '');

				case 'int':
				case 'integer':
					return value;

				case 'lowercase':
					return value.toUpperCase();

				case 'uppercase':
					return value.toLowerCase();

				default:
					return value;
			}
		}

    /*
      * Below is a example in which is necessary the prepareForNestedJson function
      *	 {
      *   	name: 'Alisha',
      *   	address: {
      *   		city: 'Welch'
      *		  }
      *  }
      */
 		static prepareForNestedJson(json) {
 			var root = {};
 			var tree = function tree(json, index) {
 				var suffix = toString.call(json) === '[object Array]' ? ']' : '';
 				for (var key in json) {
 					if (!json.hasOwnProperty(key)) {
 						continue;
 					}
 					if (!Routine.isObject(json[key])) {
 						root[index + key + suffix] = json[key];
 					}
 					if (toString.call(json[key]) === '[object Array]') {
 						tree(json[key], index + key + suffix + '[');
 					} else if (toString.call(json[key]) === '[object Object]') {
 						tree(json[key], index + key + suffix + '.');
 					}
 				}
 			};

 			tree(json, '');

 			return root;
 		}

    /**
	   *
	   *
	   */
    static applyTemplateValues(template, record, aditionalJson) {
    	var newJson = DataGridHelper.prepareForNestedJson(record);

    	//
      newJson = Object.assign(newJson, aditionalJson);

    	var keys = Object.keys(newJson);
    	var parsedTemplate = template;

    	for (let index = 0 ; index < keys.length ; index++) {
    		var key = keys[index];
    		var value = newJson[key];

			//var regexp = new RegExp('\\{' + key + '\\}', 'gi');
    		//parsedTemplate = parsedTemplate.replace(regexp, value);
    		var searchStr = '{' + key + '}';
    		var indexOf = parsedTemplate.indexOf(searchStr);
    		while (indexOf !== -1) {
    			parsedTemplate = parsedTemplate.replace(searchStr, value);
    			indexOf = parsedTemplate.indexOf(searchStr, indexOf + value.length);
    		}
    	}

    	return parsedTemplate;
    };

    static groupExpand(dataGrid, rowElement, record, rowIndex) {

			var groupIndex = rowElement.getAttribute('groupIndex');
			//Row Detail is a grouping
			if (Routine.isDefined(groupIndex)) {
				groupIndex = parseInt(groupIndex);

				//
				var childrenIndexes = [];
				var data = dataGrid.props.options.data;
				for (var index = 0; index < dataGrid.props.options.data.length; index++) {
					var rec = dataGrid.props.options.data[index];
					if (rec.groupIndex === groupIndex) {
						childrenIndexes.push(index);
					}
				}

				//
				dataGrid.managerRendererItems.insertChildrenGroup(groupIndex, childrenIndexes);
				dataGrid.element.api.repaint();
			}
		};

    static groupCollapse(dataGrid, rowElement, record, rowIndex) {

			var groupIndex = rowElement.getAttribute('groupIndex');
			//Row Detail is a grouping
			if (Routine.isDefined(groupIndex)) {
				groupIndex = parseInt(groupIndex);

				//
				dataGrid.managerRendererItems.removeAllChildrenGroup(groupIndex);
				dataGrid.rsfs.element.api.repaint();
			}
		};

}

export default DataGridHelper;
