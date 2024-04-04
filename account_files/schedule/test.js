const PlusButton = ({ onAdd }) => (
  <TouchableOpacity onPress={onAdd} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 20 }}>
    <Text style={{ color: 'white' }}>Add Schedule</Text>
  </TouchableOpacity>
);

<PlusButton onAdd={handleAddSchedule} />
const [fakeId, setFakeId] = useState(0);

const handleAddSchedule = () => {
    const newId = fakeId + 1; // Increment the fake ID
    const todayStr = new Date().toISOString().split('T')[0]; // Get today's date as string

    const newSchedule = {
      id: newId,
      name: "Magic Pill",
      dose: "2",
      time: new Date().toISOString(),
      taken: false,
      height: 100,
    };

    const updatedItems = { ...items };
    if (!updatedItems[todayStr]) {
      updatedItems[todayStr] = [];
    }
    updatedItems[todayStr].push(newSchedule);

    setItems(updatedItems);
    setFakeId(newId); // Update the fake ID for next use
};