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
      'igc-button-component': any;
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
    // const pane1 = createContentPane('content1', 'Content Pane 1');
    const pane1 = createContentPane('content1', 'Unpinned Pane 1');
    pane1.isPinned = false;

    // const pane3 = createContentPane('content3', 'Document 1');
    // const pane4 = createContentPane('content4', 'Document 2');

    // const contentPane5 = createContentPane('content5', 'Unpinned Pane 2');
    // contentPane5.isPinned = false;

    // const pane6 = createContentPane('content6', 'Tab 1');
    // const pane7 = createContentPane('content7', 'Tab 2');
    // const pane8 = createContentPane('content8', 'Content Pane 2');
    // const pane9 = createContentPane('content9', 'Floating Pane');

    // const tabPane1 = createTabPane(IgcSplitPaneOrientation.horizontal, [pane3], 200);

    const splitPane1 = createSplitPane(IgcSplitPaneOrientation.vertical, [pane1]);
    // const splitPane2 = createSplitPane(IgcSplitPaneOrientation.vertical, [tabPane1, contentPane5], 200);

    dockManagerRef.current = document.getElementById('dockManager') as IgcDockManagerComponent;
    dockManagerRef.current.layout = {
      rootPane: {
        type: IgcDockManagerPaneType.splitPane,
        orientation: IgcSplitPaneOrientation.horizontal,
        panes: [
          splitPane1,
          // splitPane2,
          // {
          //   type: IgcDockManagerPaneType.splitPane,
          //   orientation: IgcSplitPaneOrientation.vertical,
          //   panes: [
          //     {
          //       type: IgcDockManagerPaneType.tabGroupPane,
          //       size: 200,
          //       panes: [pane6],
          //     },
          //     pane8,
          //   ],
          // },
        ],
      },
      // floatingPanes: [
      //   {
      //     type: IgcDockManagerPaneType.splitPane,
      //     orientation: IgcSplitPaneOrientation.horizontal,
      //     floatingHeight: 400,
      //     floatingWidth: 850,
      //     floatingLocation: { x: 300, y: 300 },
      //     panes: [pane9],
      //   },
      // ],
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
        {/* <div slot="content1" className="dockManagerContent">
          <SampleGrid />
        </div> */}
        <div slot="content1" className="dockManagerContent">
          <button onClick={handleButtonClick}>Add new pane</button>
          <button onClick={saveLayout} className='saveButton'>Save Layout</button>
        </div>
        {panes.map((pane) => (
          <div key={paneName} slot={paneName} className="dockManagerContent">
            {contentName === 'grid' ? <SampleGrid /> : <DataGrid />}
          </div>
        ))}

        {/* <button slot="closeButton">x</button>

        <button slot="maximizeButton">
          <img src="https://www.svgrepo.com/show/419558/arrow-top-chevron-chevron-top.svg" alt="" />
        </button>

        <button slot="minimizeButton">
          <img src="https://www.svgrepo.com/show/419557/bottom-chevron-chevron-down.svg" alt="" />
        </button>

        <button slot="pinButton">
          <img src="https://www.svgrepo.com/show/154123/pin.svg" alt="" />
        </button>

        <button slot="unpinButton">
          <img src="https://www.svgrepo.com/show/154123/pin.svg" alt="" />
        </button> */}
        {/* {contentName === 'blotter' ? (
          <div slot={`${paneName}`} className="dockManagerContent">
            <Blotter />
          </div>
        ) : contentName === 'tt' ? (
          <div slot={`${paneName}`} className="dockManagerContent">
            <TradingTicket />
          </div>
        ) : null} */}
        {/* <div slot={`${paneName}`} className="dockManagerContent">
          {contentName === 'blotter' ? <Blotter /> : <TradingTicket />}
        </div> */}
        {/* <div slot="content4" className="dockManagerContent">
          <SampleGrid />
        </div>
        <div slot="content5" className="dockManagerContent">
          <SampleGrid />
        </div>
        <div slot="content6" className="dockManagerContent">
          <SampleGrid />
        </div>
        <div slot="content7" className="dockManagerContent">
          <SampleGrid />
        </div>
        <div slot="content8" className="dockManagerContent">
          <Blotter />
        </div>
        <div slot="content9" className="dockManagerContent">
          <TradingTicket />
        </div> */}
      </igc-dockmanager>
    </div>
  );
};

export default DockManagerOverview;
