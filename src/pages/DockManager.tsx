import React, { useEffect, useRef, useState } from 'react';
import { IgcDockManagerComponent, IgcDockManagerPaneType, IgcSplitPaneOrientation } from '@infragistics/igniteui-dockmanager';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import './dockManager.css';
import SampleGrid from './SampleGrid';
import DataGrid from './DataGrid';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'igc-dockmanager': any;
    }
  }
}

defineCustomElements();

const DockManagerOverview = () => {
  const dockManagerRef = useRef<IgcDockManagerComponent | null>(null);
  const [contentName, setContentName] = useState('');
  const [paneName, setPaneName] = useState('');
  const [panes, setPanes] = useState([]);

  useEffect(() => {
    dockManagerRef.current = document.getElementById('dockManager') as IgcDockManagerComponent;

    setTimeout(() => {
      const savedLayout = localStorage.getItem('dockManagerLayout');
      if (savedLayout && dockManagerRef.current && dockManagerRef.current.layout) {
        dockManagerRef.current.layout = JSON.parse(savedLayout);
      }
    }, 0);
  }, []);

  const createContentPane = (contentID: string, paneHeader: string): any => {
    const pane = {
      header: paneHeader,
      type: IgcDockManagerPaneType.contentPane,
      contentId: contentID,
    };
    return pane;
  };

  const createSplitPane = (orientation: IgcSplitPaneOrientation, contentPanes: any[], size?: number): any => {
    const pane = {
      type: IgcDockManagerPaneType.splitPane,
      orientation: orientation,
      panes: contentPanes,
      size: size,
    };
    return pane;
  };

  const createTabPane = (orientation: IgcSplitPaneOrientation, contentPanes: any[], size?: number): any => {
    const pane = {
      type: IgcDockManagerPaneType.documentHost,
      size: size,
      rootPane: {
        type: IgcDockManagerPaneType.splitPane,
        orientation: orientation,
        panes: [
          {
            type: IgcDockManagerPaneType.tabGroupPane,
            panes: contentPanes,
          },
        ],
      },
    };
    return pane;
  };

  useEffect(() => {
    const pane1 = createContentPane('content1', 'Unpinned Pane 1');
    pane1.isPinned = false;

    const splitPane1 = createSplitPane(IgcSplitPaneOrientation.vertical, [pane1]);

    dockManagerRef.current = document.getElementById('dockManager') as IgcDockManagerComponent;
    dockManagerRef.current.layout = {
      rootPane: {
        type: IgcDockManagerPaneType.splitPane,
        orientation: IgcSplitPaneOrientation.horizontal,
        panes: [
          splitPane1,
        ],
      },
    };
  }, []);

  const countPanes = (pane: any) => {
    if (!pane) {
      return 0;
    }

    let count = 0;
    if (pane.type === IgcDockManagerPaneType.contentPane) {
      count++;
    }

    if (pane.panes) {
      for (const childPane of pane.panes) {
        count += countPanes(childPane);
      }
    }

    return count;
  };

  const handleButtonClick = () => {
    const contentName = prompt('Please enter content name');
    if (contentName && dockManagerRef.current && dockManagerRef.current.layout) {
      let paneCount = countPanes(dockManagerRef.current.layout.rootPane);
      paneCount++;
      setContentName(contentName);
      setPaneName(paneCount.toString());
      const newPane = createContentPane(paneCount.toString(), contentName);
      const oldLayout = dockManagerRef.current.layout;
      const newLayout = {
        ...oldLayout,
        rootPane: {
          ...oldLayout.rootPane,
          panes: oldLayout.rootPane.panes.map((pane, index) => {
            if (pane.type === IgcDockManagerPaneType.splitPane && index === 0) {
              return {
                ...pane,
                panes: [...pane.panes, newPane],
              };
            }
            return pane;
          }),
        },
      };
      setPanes((prevPanes) => [...prevPanes, newPane]);
      dockManagerRef.current.layout = newLayout;
    }
  };

  const saveLayout = () => {
    if (dockManagerRef.current && dockManagerRef.current.layout) {
      let currentLayout = dockManagerRef.current.layout;
      localStorage.setItem('dockManagerLayout', JSON.stringify(currentLayout));
    }
  };

  return (
    <div>
      <igc-dockmanager id="dockManager" ref={dockManagerRef}>
        <div slot="content1" className="dockManagerContent">
          <button onClick={handleButtonClick}>Add new pane</button>
          <button onClick={saveLayout} className='saveButton'>Save Layout</button>
        </div>
        {panes.map((pane) => (
          <div key={paneName} slot={paneName} className="dockManagerContent">
            {contentName === 'grid' ? <SampleGrid /> : <DataGrid />}
          </div>
        ))}
      </igc-dockmanager>
    </div>
  );
};

export default DockManagerOverview;
