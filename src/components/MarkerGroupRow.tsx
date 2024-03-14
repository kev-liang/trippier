const MarkerGroupRow = (props: any) => {
  const { marker } = props;

  return <div>
    {marker.formattedAddress}
  </div>
};

export default MarkerGroupRow
