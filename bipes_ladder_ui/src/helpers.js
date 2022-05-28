import shortid from "shortid";
import { ROW, COLUMN, COMPONENT } from "./constants";

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);

    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(
      nodeChildren.children,
      splitDropZoneChildrenPath,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitItemPath) => {
  if (splitItemPath.length === 1) {
    const itemIndex = Number(splitItemPath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitItemPath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(
      nodeChildren.children,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children,
      splitItemChildrenPath,
      item
    )
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout,
  splitDropZonePath,
  splitItemPath
) => reorderChildren(layout, splitDropZonePath, splitItemPath);

export const handleAddColumDataToRow = layout => {
  const layoutCopy = [...layout];
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: shortid.generate(),
    children: []
  };

  const getRow = row => {
    if (!row.children.length) {
      row.children = [COLUMN_STRUCTURE];
    }

    return row;
  }

  return layoutCopy.map(getRow);
};

export const handleMoveToDifferentParent = (
  layout,
  splitDropZonePath,
  splitItemPath,
  item
) => {
  let newLayoutStructure;

  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: shortid.generate(),
    children: [item]
  };

  const ROW_STRUCTURE = {
    type: ROW,
    id: shortid.generate()
  };

  const isLengthOne = {
    ...ROW_STRUCTURE,
    children: [item]
  }

  const isLengthTwo = {
    ...ROW_STRUCTURE,
    children: [COLUMN_STRUCTURE]
  }

  const getNewLayoutStructure = length => {
    if (length === 1) {
      if (item.type === COLUMN) {
        newLayoutStructure = {
          ...isLengthOne
        }

        return newLayoutStructure
      }

      newLayoutStructure = {
        ...isLengthTwo
      }

      return newLayoutStructure
    }

    if (length === 2) {
      if (item.type === COMPONENT) {
        newLayoutStructure = COLUMN_STRUCTURE
        return newLayoutStructure
      }

      newLayoutStructure = item
      return newLayoutStructure
    }

    newLayoutStructure = item
    return newLayoutStructure
  }

  newLayoutStructure = getNewLayoutStructure(splitDropZonePath.length)

  let updatedLayout = layout;

  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout = handleAddColumDataToRow(updatedLayout);
  updatedLayout = addChildToChildren(
    updatedLayout,
    splitDropZonePath,
    newLayoutStructure
  );

  return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (
  layout,
  splitDropZonePath,
  item
) => {
  let newLayoutStructure;

  const isLengthOne = {
    type: ROW,
    id: shortid.generate(),
    children: [{ type: COLUMN, id: shortid.generate(), children: [item] }]
  }

  const isLengthTwo = {
    type: COLUMN,
    id: shortid.generate(),
    children: [item]
  }

  const getNewLayoutStructure = length => {
    if (length === 1) {
      newLayoutStructure = {
        ...isLengthOne
      }

      return newLayoutStructure
    }

    if (length === 2) {
      newLayoutStructure = {
        ...isLengthTwo
      }

      return newLayoutStructure
    }

    newLayoutStructure = item
    return newLayoutStructure
  }

  newLayoutStructure = getNewLayoutStructure(splitDropZonePath.length)

  return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
  return removeChildFromChildren(layout, splitItemPath);
};

/*JSON Handle*/
export const createJSON = obj => JSON.stringify(obj);

export const parseJSON = json => JSON.parse(json);

export const generateLayoutFromJSON = json => { }

const storageUndefined = typeof (Storage) === "undefined"

export const setStorage = (json, itemName) => {
  if (!storageUndefined) {
    localStorage.setItem(itemName, json);
  }
}

export const getStorage = itemName => !storageUndefined
  ? localStorage.getItem(itemName)
  : null

export const getLocalStorage = () => !storageUndefined
  ? localStorage
  : [-1]

export const getAllLocalStorage = () => {
  const getItems = (obj, k) => ({ ...obj, [k]: localStorage.getItem(k) })

  return Object
    .keys(localStorage)
    .reduce(getItems);
}
