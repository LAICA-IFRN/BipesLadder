import { Droppable, Draggable} from 'react-beautiful-dnd'
import React from 'react';
import {direitaitens} from "./App";

export default class Lista1 extends React.Component {
    render() {
        return(
          <div class="listadadireita" id='lista1'>
          <Droppable droppableId='listaNumero1'>
            {(provided) => (
              <ul className="direitaFotos" {...provided.droppableProps} ref={provided.innerRef}>
                {direitaitens.map(({id, name, thumb}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <div className="fotos-thumb">
                              <img src={thumb} alt={` ${name} Thumb`} />
                            </div>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
           </Droppable>
        </div>
        )
    }
}