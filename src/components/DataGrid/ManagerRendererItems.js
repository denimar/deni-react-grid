import Routine from '../../util/Routine';
import DataGridHelper from './DataGridHelper';

/**
 * This guy manages which items the grid should render
 *
 *
 */
class ManagerRendererItems {

  constructor(dataGrid) {
    this.dataGrid = dataGrid;
    this.rowHeight = parseInt(dataGrid.props.options.rowHeight.replace('px', ''));
		this.items = [];
		this.renderedItems = [];
  }

  //
  createItems() {
    this.items = [];
    var data;
    var top = 0;

    //
    if (this.dataGrid.element.api.isGrouped()) {
      for (let index = 0 ; index < this.dataGrid.props.options.dataGroup.length ; index++) {

        //
        this.items.push({
          top: top,
          height: this.rowHeight,
          rowIndex: this.dataGrid.props.options.dataGroup[index].rowIndex,
          groupIndex: index,
          children: this.dataGrid.props.options.dataGroup[index].children
        });
        top += this.rowHeight;

        //
        if ((DataGridHelper.hasColumnFooter(this.dataGrid)) && (this.dataGrid.columnFooterRowsNumberGrouping > 0)) {
          //
          let rowHeight = this.dataGrid.props.options.columnGroupingFooterRowHeight;
          rowHeight = parseInt(rowHeight.toString().replace('px', ''));
          rowHeight = rowHeight * this.dataGrid.columnFooterRowsNumberGrouping;

          //
          this.items.push({
            top: top,
            height: rowHeight,
            rowIndex: this.dataGrid.props.options.dataGroup[index].rowIndex,
            groupIndex: index,
            children: this.dataGrid.props.options.dataGroup[index].children,
            footerContainer: true
          });
          top += rowHeight;
        }
      }
    //
    } else {
      //It might have more than one record by row whe is configured 'cardView' property
      var recordsByRow = Routine.isDefined(this.dataGrid.props.options.cardView) ? this.dataGrid.props.options.cardView.numberOfColumns : 1;

      //for (let index = 0 ; index < this.dataGrid.props.options.data.length ; index++) {
      var index = 0;
      while (index < this.dataGrid.props.options.data.length) {

        for (let indexRecord = 0 ; indexRecord < recordsByRow ; indexRecord++) {
          this.items.push({
            top: top,
            height: this.rowHeight,
            rowIndex: index
          });
          top += this.rowHeight;

          if ((this.dataGrid.props.options.rowDetails) && (this.dataGrid.props.options.rowDetails.autoExpand)) {
            let rowHeight = this.dataGrid.props.options.rowDetails.height || 50;
            rowHeight = parseInt(rowHeight.toString().replace('px', ''));
            this.items.push({
              top: top,
              height: rowHeight,
              rowIndex: index,
              rowDetails: true
            });
            top += rowHeight;
          }

          index++;
        }
      }
    }
  }

  //
  removeRow(dataGrid, rowIndex) {
    var found = false;
    var top;
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];

      if (found) {
        item.rowIndex--;
        item.top = top;
        if (item.rendered) {
          item.rowElement.remove();
        }
        item.rendered = false;
        top += item.height;
      } else {
        if (item.rowIndex === rowIndex) {
          found = true;
          top = item.top;
          this.items.splice(index, 1);
          if (item.rendered) {
            item.rowElement.remove();
          }
          dataGrid.props.options.data.splice(rowIndex, 1);
          index--;
        }
      }
    }

    var rowsContainerHeight = this.items[this.items.length - 1].top + this.rowHeight;
    dataGrid.bodyContainer.height(rowsContainerHeight);
    dataGrid.fixedColsBodyContainer.height(rowsContainerHeight);
  }

  //
  insertRowDefailtBox(rowIndex) {

    var found = false;
    var top;
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];

      if (found) {
        item.top = top;
        if (item.rendered) {
          item.rowElement.css('top', top + 'px');
        }
        top += item.height;
      } else {
        if (item.rowIndex === rowIndex) {
          item.expanded = true;
          found = true;
          top = item.top + item.height - 2;

          var rowHeight = this.dataGrid.props.options.rowDetails.height || 50;
          rowHeight = parseInt(rowHeight.toString().replace('px', ''));

          this.items.splice(index + 1, 0, {
            top: top,
            height: rowHeight, //elementRowDefailBox.height(), //TODO: <<--
            rowIndex: rowIndex,
            rowDetails: true
            //rowElement: elementRowDefailBox,
            //rendered: true //it is important!
          });
          index++;
          top += rowHeight;
        }
      }
    }

    var rowsContainerHeight = this.items[this.items.length - 1].top + this.rowHeight;
    this.dataGrid.bodyContainer.height(rowsContainerHeight);
    this.dataGrid.fixedColsBodyContainer.height(rowsContainerHeight);
  }

  //
  removeRowDetailtBox(rowIndex) {

    var found = false;
    var top;
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];

      if (found) {
        item.top = top;
        if (item.rendered) {
          item.rowElement.css('top', top + 'px');
        }
        top += item.height;
      } else {
        if (item.rowIndex === rowIndex) {
          item.expanded = false;
          found = true;
          top = item.top + item.height;
          //this.items[index+1].rowElement.remove();
          this.dataGrid.bodyContainer.find('.ui-row.row-detail-container[rowindex=' + rowIndex + ']').remove();

          //remove the row detail box
          this.items.splice(index+1, 1);
        }
      }
    }

    var rowsContainerHeight = this.items[this.items.length - 1].top + this.rowHeight;
    this.dataGrid.bodyContainer.height(rowsContainerHeight);
    this.dataGrid.fixedColsBodyContainer.height(rowsContainerHeight);
  }

  //
  insertChildrenGroup(groupIndex, childrenIndexes) {

    var found = false;
    var top;
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];

      if (found) {
        item.top = top;
        if (item.rendered) {
          item.rowElement.style.top = top + 'px';
        }
        top += item.height;
      } else {
        if (item.groupIndex === groupIndex) {
          item.expanded = true;
          found = true;
          top = item.top + item.height;

          for (var recIndex = 0 ; recIndex < childrenIndexes.length ; recIndex++) {
            this.items.splice(index + 1 + recIndex, 0, {
              top: top,
              height: this.rowHeight,
              rowIndex: childrenIndexes[recIndex],
              groupIndex: groupIndex,
              indexInsideGroup: recIndex
            });
            top += this.rowHeight;
          }
          index += childrenIndexes.length;
        }
      }
    }

    var rowsContainerHeight = this.items[this.items.length - 1].top + this.rowHeight;
    this.dataGrid.bodyContainer.style.height = rowsContainerHeight + 'px';
    this.dataGrid.fixedColsBodyContainer.style.height = rowsContainerHeight + 'px';
  }

  //
  removeAllChildrenGroup(groupIndex) {

    var found = false;
    var top;
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];

      if (found) {
        item.top = top;
        if (item.rendered) {
          item.rowElement.style.top = top + 'px';
        }
        top += item.height;
      } else {
        if (item.groupIndex === groupIndex) {
          item.expanded = false;
          found = true;
          index++;
          while (this.items[index].groupIndex === groupIndex) {
            var childItem = this.items[index];
            if (childItem.footerContainer) {
              break;
            } else {
              if (childItem.rendered) {
                childItem.rowElement.remove();
                //childItem.rendered = false;
              }
              this.items.splice(index, 1);
            }
          }
          index--;
          top = item.top + item.height;
        }
      }
    }

    var rowsContainerHeight = this.items[this.items.length - 1].top + this.rowHeight;
    this.dataGrid.bodyContainer.height(rowsContainerHeight);
    this.dataGrid.fixedColsBodyContainer.height(rowsContainerHeight);
  }


  //
  getVisibleRows() {

    //
    var itemsToRender = [];

    //
    var scrollTop = this.dataGrid.bodyViewport.scrollTop;
    var scrollBottom = scrollTop + this.dataGrid.bodyViewport.clientHeight;

    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];
      if (((item.top + item.height) > scrollTop) && (item.top < scrollBottom)) {
        itemsToRender.push(item);
      }
    }

    return itemsToRender;
  }

  //
  removeAllNotVisibleElementsRows(dataGrid, visibleRows) {
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];
      if (item.rendered) {
        if (visibleRows.indexOf(item) === -1) {

          //
          if (!item.footerContainer) {
            //
            var selector = '.ui-row[rowindex=' + item.rowIndex + ']:not(.ui-grouping-footer-container)';

            //
            dataGrid.bodyContainer.find(selector).remove();

            //
            dataGrid.fixedColsBodyContainer.find(selector).remove();

            //
            item.rendered = false;
            item.rowElement = undefined;
          }
        }
      }
    }
  }

  //
  setAllElementsToNotRendered() {
    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];
      item.rendered = false;
      item.rowElement = undefined;
    }
  }

  //
  getInfoGroup(groupIndex) {

    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];
      //it get only the rows which are groping
      if ((item.groupIndex === groupIndex) && (Routine.isDefined(item.children))) {
        return item;
      }
    }

    return null;
  }

  //
  getInfoRow(rowIndex) {

    for (let index = 0 ; index < this.items.length ; index++) {
      var item = this.items[index];
      //it don't get the rows which are groping
      //if ((item.rowIndex == rowIndex) && (!Routine.isDefined(item.children))) {
      if (item.rowIndex === rowIndex) {
        return item;
      }
    }

    return null;
  }

  adjustElementTop(itemRendered) {
    itemRendered.rowElement.css('top', itemRendered.top + 'px');
  }

}

export default ManagerRendererItems;
