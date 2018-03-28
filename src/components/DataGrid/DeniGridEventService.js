import Routine from '../../util/Routine';
import DataGridHelper from './DataGridHelper';
import Constant from '../../util/Constant'

class DeniGridEventService {

  constructor(dataGrid) {
    this.dataGrid = dataGrid;

    this.dataGrid.bodyViewport.addEventListener('scroll', this.bodyViewportScroll.bind(this));
  }

  //
	//
	onrenderer(rowElement, fixedRowElement, record, itemToRender) {

		/*
		// Card View
		if (Routine.isDefined(controller.options.cardView)) {
			//
			var divCell = this._createDivCell(controller, rowElement);
			rowElement.css('width', '100%');
			divCell.css('width', '100%');
			valueToRender = DataGridHelper.applyTemplateValues(getTemplateCardView, record);
			divCell.html(valueToRender);
		*/

		// Row Template
		if (Routine.isDefined(this.dataGrid.props.options.rowTemplate)) {
			//
			let divCell = this._createDivCell(rowElement);
			rowElement.style.width = '100%';
			divCell.style.width = '100%';
			let valueToRender = DataGridHelper.applyTemplateValues(this.dataGrid.props.options.rowTemplate, record);
			divCell.innerHTML = valueToRender;

		//Row Detail - Grouping or other type of row details
  } else if (rowElement.classList.contains('row-detail')) {
			//DataGridHelper.renderCommonRow(this.dataGrid, rowElement, record, itemToRender.rowIndex);

			//
			let divCell = this._createDivCell(rowElement);
			divCell.classList.add('row-detail');

			//
			let spanCellInner = this._createDivCellInner(divCell);
			spanCellInner.classList.add('row-detail');
			if (itemToRender.expanded) {
				spanCellInner.classList.add('collapse');
			} else {
				spanCellInner.classList.add('expand');
			}
			spanCellInner.style.cursor = 'pointer';

			spanCellInner.addEventListener('click', (event) => {
			 	//if (event.offsetX <= 12) { //:before pseudo element width
			 		Routine.toggleClass(spanCellInner, 'expand', 'collapse');
			 		Routine.toggleClass(rowElement, 'expand', 'scollapse');

			 		if (spanCellInner.classList.contains('collapse')) {
			 			DataGridHelper.groupExpand(this.dataGrid, rowElement, record, itemToRender.rowIndex);
			 		} else {
			 			DataGridHelper.groupCollapse(this.dataGrid, rowElement, record, itemToRender.rowIndex);
			 		}
			 	//}
			});

			let valueToRender;
			if (this.dataGrid.props.options.grouping.template) {
				let totalRowsInGroup = parseInt(rowElement.getAttribute('children') || 0);
				valueToRender = DataGridHelper.applyTemplateValues(this.dataGrid.props.options.grouping.template, record, {count: totalRowsInGroup});
			}

			spanCellInner.innerHTML = valueToRender;

		// Grouping Footer
		} else if (rowElement.classList.contains('ui-grouping-footer-container')) {
			let columns = this.dataGrid.props.options.columns;
			let totalRowsInGroup = parseInt(rowElement.getAttribute('children') || 0);
			let records = this.dataGrid.props.options.data.slice(itemToRender.rowIndex, itemToRender.rowIndex + totalRowsInGroup);

			//
			DataGridHelper.createColumnFooters(this.dataGrid, rowElement, columns, false);
			//
			DataGridHelper.renderColumnFooters(this.dataGrid, rowElement, columns, records, false);

		// (Common Row)
		} else {
			//rowElement.css('width', '100%');

			let isRowSelected = rowElement.classList.contains('selected');
			let columns = DataGridHelper.getColumns(this.dataGrid, this.dataGrid.props.options.columns);
			let colIndex = 0;
			for (let index = 0 ; index < columns.length ; index++) {

				//
				if (index === 0) {
					//if Fixed Columns
					if (this.dataGrid.props.options.fixedCols) {

						//if has checkbox
						if (this.dataGrid.props.options.fixedCols.checkbox) {
							let divCellIndicator = this._createDivCell(fixedRowElement);
							divCellIndicator.style.width = Constant.FIXED_COL_CHECKBOX_WIDTH;
							divCellIndicator.classList.add('auxiliar-fixed-column');
							let spanCellIndicatorInner = this._createDivCellInner(divCellIndicator);
							spanCellIndicatorInner.classList.add('checkbox');
							let inputCheck = $(document.createElement('input'));
							inputCheck.setAttribute('type', 'checkbox');
							inputCheck.css({
								cursor: 'pointer'
							});
							spanCellIndicatorInner.appendChild(inputCheck);
							colIndex++;
						}

						//if has indicator
						if (this.dataGrid.props.options.fixedCols.indicator) {
							let divCellIndicator = this._createDivCell(fixedRowElement);
							divCellIndicator.style.width = Constant.FIXED_COL_INDICATOR_WIDTH;
							divCellIndicator.classList.add('auxiliar-fixed-column');
							let spanCellIndicatorInner = this._createDivCellInner(divCellIndicator);
							spanCellIndicatorInner.classList.add('indicator');
							colIndex++;
						}

						//if has row number
						if (this.dataGrid.props.options.fixedCols.rowNumber) {
							let divCellRowNumber = this._createDivCell(fixedRowElement);
							divCellRowNumber.style.width = Constant.FIXED_COL_ROWNUMBER_WIDTH;
							divCellRowNumber.classList.add('auxiliar-fixed-column');
							let spanCellRowNumberInner = this._createDivCellInner(divCellRowNumber);
							spanCellRowNumberInner.classList.add('rownumber');
							spanCellRowNumberInner.innerHTML = itemToRender.rowIndex + 1;
							colIndex++;
						}
					}
				}

				//
				let column = columns[index];


				//
				let divCell;

				//if fixed column?
				if (DataGridHelper.isFixedColumn(this.dataGrid, column.name)) {
					divCell = this._createDivCell(fixedRowElement);
				} else {
					divCell = this._createDivCell(rowElement);
				}
				divCell.setAttribute('colIndex', colIndex);

				//
				let spanCellInner = this._createDivCellInner(divCell);

				//action column
				if (column.action) {
					spanCellInner.style.textAlign = 'center';
					spanCellInner.classList.add('ui-cell-inner-action');

					let iconActionColumn = column.action.mdIcon || column.action.icon;
					if (Routine.isFunction(iconActionColumn)) {
						iconActionColumn = iconActionColumn(record);
					}
					let imgActionColumn;
					if (column.action.mdIcon) { //Usa o md-icon do Angular Material
						let imgActionColumnBtn = $(document.createElement('md-button'));

						if (column.action.tooltip) {
							let imgActionColumnBtnTooltip = $(document.createElement('md-tooltip'));
							let textTooltip;

							if (Routine.isFunction(column.action.tooltip)) {
								textTooltip = column.action.tooltip(record);
							} else {
								textTooltip = column.action.tooltip;
							}
							imgActionColumnBtnTooltip.innerHTML = textTooltip;
							imgActionColumnBtn.appendChild(imgActionColumnBtnTooltip);
						}

						imgActionColumn = $(document.createElement('md-icon'));
						imgActionColumn.classList.add('material-icons');
						imgActionColumn.innerHTML = iconActionColumn;
						imgActionColumnBtn.appendChild(imgActionColumn);

						let imgActionColumnBtnCompiled = $compile(imgActionColumnBtn) (this.dataGrid.scope);
						spanCellInner.appendChild(imgActionColumnBtn);
						imgActionColumnBtn.find('md-icon').prop('column', column);

						imgActionColumnBtn.click(function(event) {
							let imgAction = $(event.currentTarget).find('md-icon');
							let colAction = imgAction.prop('column');
							colAction.action.fn(record, column, imgAction);
						});


					} else {
						imgActionColumn = document.createElement('img');
						imgActionColumn.setAttribute('src', iconActionColumn);
						imgActionColumn.setAttribute('title', column.action.tooltip);
						spanCellInner.appendChild(imgActionColumn);
						imgActionColumn['column'] = column;

						imgActionColumn.addEventListener('click', event => {
							let imgAction = event.currentTarget;
							let colAction = imgAction['column'];
							colAction.action.fn(record, column, imgActionColumn);
						});

						imgActionColumn.style.cursor = 'pointer';
					}

				} else {

					//
					if (index === 0) {
						//
						//rowDetails Property
						if (this.dataGrid.props.options.rowDetails) {
							spanCellInner.classList.add('row-detail');

							if ((itemToRender.expanded) || (this.dataGrid.props.options.rowDetails.autoExpand === true)) {
								spanCellInner.classList.add('collapse');
							} else {
								spanCellInner.classList.add('expand');
							}

							spanCellInner.click(function(event) {
							 	if (event.offsetX <= 12) { //:before pseudo element width
							 		var target = $(event.target);

							 		if (target.classList.contains('collapse')) {
							 			DataGridHelper.rowDetailsCollapse(this.dataGrid, rowElement, record, itemToRender.rowIndex);
							 		} else {
							 			DataGridHelper.rowDetailsExpand(this.dataGrid, rowElement, record, itemToRender.rowIndex);
							 		}
							 	}
							});

						}
					}

					//
					//var style = column.style || {};
					//divCell.css(angular.extend(style, {
					//	'text-align': column.align || 'left'
					//}));
          divCell.style.textAlign = column.align || 'left';

					//Margin First column inside of grouping
					if ((index === 0) && (this.dataGrid.element.api.isGrouped())) {
						divCell.style.paddingLeft = '20px';
					}

					var value = null;
					try {
						value = eval('record.' + column.name); //value = record[column.name];
					} catch (err) {
					}

					//Is there a specific render for this field?
					if (column.renderer) {
						value = column.renderer(value, record, columns, itemToRender.rowIndex);
					}

					var formattedValue = value;
					if (Routine.isDefined(column.format)) {
						formattedValue = DataGridHelper.getFormatedValue(value, column.format);
					}

					var rendererRealcedCellsFn = function(valuesToField, allFields, realceStyle) {
						return _rendererRealcedCells(column, allFields, formattedValue, valuesToField, realceStyle);
					};

					//Is there something to realce (Used in Searches and Filters)
					if (this.dataGrid.searchInfo) {
						if (isRowSelected) {
							//TODO: test this block
							formattedValue = rendererRealcedCellsFn(this.dataGrid.searchInfo.valuesToFilter, this.dataGrid.props.options.filter.allFields, this.dataGrid.searchInfo.opts.inLine.realce);
						}
					} else if (column.filter) {
						formattedValue = rendererRealcedCellsFn(this.dataGrid.props.options.filter.model, this.dataGrid.props.options.filter.allFields, this.dataGrid.props.options.filter.realce);
					}

					//
					spanCellInner.innerHTML = formattedValue;
				}

				//realPercentageWidth cause effect only when there are more then one level of columns
				divCell.style.width = column.realPercentageWidth || column.width;

				//
				colIndex++;
			}

		}
	}

  //
  //
  //
  _createDivCell(rowElement) {

    //
    let divCell = document.createElement('div');
    divCell.classList.add('ui-cell');

    if (this.dataGrid.props.options.colLines) {
      divCell.style.borderRight = 'solid 1px #e6e6e6';
    }

    if (this.dataGrid.props.options.rowLines) {
      divCell.style.borderBottom = 'solid 1px #e6e6e6';
    }

    if (!rowElement.classList.contains('row-detail')) {
      ///////////////////////////////////''
      //Set the events here
      ///////////////////////////////////
      //mouseenter
        divCell.addEventListener('mouseenter', event => {
        // if (!this.dataGrid.enabled) {
        //   return;
        // }

          //selType = 'row'
          if (this.dataGrid.props.options.selType === 'row') {
            //$(event.currentTarget).parent().find('.ui-cell').classList.add('hover');
            //
            this.dataGrid.bodyViewport.querySelector('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]:not(.row-detail)').querySelectorAll('.ui-cell').forEach(item => { item.classList.add('hover') });

            if (this.dataGrid.props.options.fixedCols) {
              let fixedCells = this.dataGrid.fixedColsBodyViewport.querySelectorAll('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]:not(.row-detail) .ui-cell');
              fixedCells.forEach(item => { item.classList.add('hover') });
            }

            //selType = 'cell'
          } else {
            event.currentTarget.classList.add('hover');
          }

        });

      //mouseleave
        divCell.addEventListener('mouseleave', event => {
          // if (!this.dataGrid.enabled) {
          //   return;
          // }

            //$(event.currentTarget).parent().find('.ui-cell').removeClass('hover');
          //
          this.dataGrid.bodyViewport.querySelector('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]').querySelectorAll('.ui-cell').forEach(item => { item.classList.remove('hover') });

          if (this.dataGrid.props.options.fixedCols) {
            this.dataGrid.fixedColsBodyViewport.querySelector('.ui-row[rowindex="' + rowElement.getAttribute('rowindex') + '"]').querySelectorAll('.ui-cell').forEach(item => { item.classList.remove('hover') });
          }

        });

        //mousedown
        divCell.addEventListener('mousedown', event => {
          // if (!this.dataGrid.enabled) {
          //   return;
          // }

            if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

              //selType = 'row'
              if (this.dataGrid.props.options.selType === 'row') {
                let divCell = event.currentTarget;
                let rowElement = Routine.getClosest(divCell, '.ui-row');
                let rowIndex = parseInt(rowElement.getAttribute('rowindex'));

                if (rowIndex !== this.dataGrid.element.api.getSelectedRowIndex()) {
                  this.dataGrid.element.api.selectRow(rowIndex);
                }

            //selType = 'cell'
            } else {
              //$(event.currentTarget).parent().find('.ui-cell').classList.add('hover');
              let divCell = event.currentTarget;
              let colIndex = parseInt(divCell.getAttribute('colIndex'));
              let rowElement = Routine.getClosest(divCell, '.ui-row');
              let rowIndex = parseInt(rowElement.getAttribute('rowindex'));

              this.dataGrid.element.api.selectCell(rowIndex, colIndex);
            }

          }
        });

      //doubleclick
        divCell.addEventListener('dblclick', event => {
          let targetEl = $(event.target);
          if (targetEl.classList.contains('ui-cell-inner')) {
            let divCell = $(event.currentTarget);
            let colIndex = parseInt(divCell.getAttribute('colIndex'));
          let columns = uiDeniGridHelperService.getColumns(this.dataGrid, this.dataGrid.props.options.columns);
          let column = columns[colIndex];

          if (column.editor) {
            let rowElement = Routine.getClosest(divCell, '.ui-row');
            let rowIndex = parseInt(rowElement.getAttribute('rowindex'));
            let record = this.dataGrid.props.options.data[rowIndex];
            uiDeniGridHelperService.setInputEditorDivCell(this.dataGrid, record, column, divCell);
          }
        }
        });

      ///////////////////////////////////
      ///////////////////////////////////
    }

    rowElement.appendChild(divCell);

    return divCell;
  }

  //
  //
  //
  _createDivCellInner(divCellParent) {
    var spanCellInner = document.createElement('span');
    spanCellInner.classList.add('ui-cell-inner');

    divCellParent.appendChild(spanCellInner);

    return spanCellInner;
  }

  onafterrepaint() {
    /*
    this.dataGrid.clientWidth;
    var columns = uiDeniGridHelperService.getColumns(this.dataGrid, this.dataGrid.options.columns);
    //Any column was specified in percentage? TODO: create a function to get this
    var anyColumnInPercentage = false;
    for (var colIndex = 0 ; colIndex < this.dataGrid.options.columns.length ; colIndex++) {
      if (this.dataGrid.options.columns[colIndex].width.toString().indexOf('%') != -1) {
        anyColumnInPercentage = true;
        break;
      }
    }
    */


    DataGridHelper.adjustAllColumnWidtsAccordingColumnHeader(this.dataGrid);
  }

  bodyViewportScroll(event) {
    let element = this.dataGrid.element;
    var currentLeft = this.scrollLeft || 0;

    //Vertical Scroll
    if (this.dataGrid.bodyViewport.currentScrollLeft === currentLeft) {
      this.dataGrid.bodyViewport.currentScrollTop = this.dataGrid.bodyViewport.scrollTop;

      var firstViewRow = this.dataGrid.bodyViewport.querySelector('.ui-row');
      if (firstViewRow) {
        //if there is at least one record
        var boundingClientTop = firstViewRow.getBoundingClientRect().top;

        //
        var top = this.dataGrid.bodyViewport.scrollTop * -1 + 'px';

        //
        if (this.dataGrid.props.options.fixedCols) {
          this.dataGrid.fixedColsBodyContainer.style.top = top;
        }
        //
        //this.dataGrid.footerDivContainer.find('.ui-deni-grid-footer').css('top', top);
        //this.dataGrid.footerDivContainer.css('left', left);
      }
    }
    //Horizontal Scroll
    else {
        this.dataGrid.bodyViewport.currentScrollLeft = currentLeft;

        var _firstViewRow = this.dataGrid.bodyViewport.querySelector('.ui-row');
        if (_firstViewRow) {
          //if there is at least one record
          var boundingClientLeft = _firstViewRow.getBoundingClientRect().left;

          //
          var left = this.dataGrid.bodyViewport.currentScrollLeft * -1 + 'px';

          //
          this.dataGrid.headerContainer.style.left = left + 'px';

          //Are there footer?
          if (DataGridHelper.hasColumnFooter(this.dataGrid)) {
            //
            this.dataGrid.footerDivContainer.querySelector('.ui-deni-grid-footer').style.left = left + 'px';
            //this.dataGrid.footerDivContainer.css('left', left);
          }
        }
      }

    //
    element.api.repaint();
  };

}

export default DeniGridEventService;
