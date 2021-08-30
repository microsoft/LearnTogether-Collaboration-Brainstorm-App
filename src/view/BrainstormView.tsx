import { mergeStyles, Spinner } from "@fluentui/react";
import { AzureResources } from "@fluidframework/azure-client";
import { useState, useContext } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrainstormModel, createBrainstormModel } from "../BrainstormModel";
import UserContext from "../userContext";
import { Header } from "./Header";
import { ItemsList } from "./ItemsList";
import { NoteSpace } from "./NoteSpace";

export const BrainstormView = (props: { frsResources: AzureResources }) => {
  const { frsResources: { fluidContainer } } = props;
  const [model] = useState<BrainstormModel>(createBrainstormModel(fluidContainer));
  const user = useContext(UserContext);
  const wrapperClass = mergeStyles({
    height: "100%",
    display: "flex",
    flexDirection: "column"
  });

  if (user === undefined) {
    return <Spinner />;
  }

  return (
    <div className={wrapperClass}>
      <Header
        model={model}
        author={user}
      />
        <div className="items-list">
          <ItemsList model={model} />
        </div>
        <div>
          <DndProvider backend={HTML5Backend}>
            <NoteSpace
              model={model}
              author={user}
            />
          </DndProvider>
        </div>
    </div>
  );
};
