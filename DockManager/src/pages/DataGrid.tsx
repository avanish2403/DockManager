import { IgrDataGrid, IgrTextColumn } from 'igniteui-react-grids';

const products = [
  { Symbol: 'GOOG', Side: 'Buy', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'AAPL', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'IBM', Side: 'Buy', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'A', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'GOOG', Side: 'Buy', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'AAPL', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'IBM', Side: 'Buy', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'A', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'AAPL', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'IBM', Side: 'Buy', Quantity: '10', Account: 'test', Broker: 'UBS' },
  { Symbol: 'A', Side: 'Sell', Quantity: '10', Account: 'test', Broker: 'UBS' },
];

export default function InfragisticsGrid() {
  return (
    <div
      className="gride"
      style={{
        opacity: 1,
        padding: '8px',
        border: '1px solid #000',
        margin: '8px',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <IgrDataGrid
        height="calc(100% - 40px)"
        width="100%"
        columnResizingAnimationMode="Interpolate"
        columnResizingMode="Deferred"
        columnResizingSeparatorWidth={1}
        autoGenerateColumns={false}
        defaultColumnMinWidth={100}
        dataSource={products}
        isColumnOptionsEnabled="true"
      >
        <IgrTextColumn field="Symbol" horizontalAlignment="center" />
        <IgrTextColumn field="Side" horizontalAlignment="center" />
        <IgrTextColumn field="Quantity" horizontalAlignment="center" />
        <IgrTextColumn field="Account" horizontalAlignment="center" />
        <IgrTextColumn field="Broker" horizontalAlignment="center" />
      </IgrDataGrid>
    </div>
  );
}
