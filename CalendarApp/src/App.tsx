import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Button, StyleSheet, Platform } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import DateTimePickerModal from '@react-native-community/datetimepicker';

const App: React.FC = () => {
  const [calendarKey, setCalendarKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<{ [key: string]: { description: string, time: string }[] }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [appointmentDescription, setAppointmentDescription] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  // Handle day press on the calendar
  const handleDayPress = (day: DateData | null) => {
    if (!day || !day.dateString) {
      // If day is null/undefined, use today's date
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setSelectedDate(todayString);
    } else {
      setSelectedDate(day.dateString);
    }
  };

  const getMarkedDates = () => {
      return Object.keys(appointments).reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: 'blue' };
        return acc;
      }, {} as Record<string, { marked: boolean; dotColor: string }>);
    };

  // Handle saving an appointment
  const handleSaveAppointment = () => {

    console.log("handle save appointment");

    if (appointmentDescription.trim()) {
      // Ensure selectedDate is correctly set
      const formattedDate = selectedTime.toISOString().split('T')[0];
      setSelectedDate(formattedDate);

      // Format the time into "HH:mm" format
      const timeString = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;

      setAppointments((prev) => {
        const newAppointments = prev[formattedDate] ? [...prev[formattedDate]] : [];
        newAppointments.push({ description: appointmentDescription, time: timeString });

        return { ...prev, [formattedDate]: newAppointments };
      });

      // Force re-render
      setForceUpdate((prev) => !prev);

      // Reset state after saving the appointment
      setModalVisible(false);
      setAppointmentDescription('');
      setSelectedTime(new Date());
    }
  };


  // Ensure the correct date is set when choosing a time
  const handleTimeChange = (event: any, date?: Date | null) => {
    console.log("time change");
    if (date instanceof Date) {
      console.log("date is a date");
      console.log(date);
      setSelectedTime(date);
      setSelectedDate(date.toISOString().split('T')[0]); // Update selectedDate when time is picked
    }
    else if(!date)
    {
        console.warn("invalid date selected");
    }
    setShowTimePicker(false);
  };

  useEffect(() => {
    setSelectedDate((prev) => prev); // Triggers a re-render
    setAppointments((prev) => prev);
  }, [appointments]);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        key={calendarKey}
         onDayPress={handleDayPress}
         markedDates={getMarkedDates()}
      />

            <Text style={styles.appointmentText}>
              {appointments[selectedDate] && appointments[selectedDate].length > 0
                ? `Appointments for ${selectedDate}:`
                : 'No appointments set for this day'}
            </Text>

            {/* Display all appointments for the selected day */}
            {appointments[selectedDate]?.map((appointment, index) => (
              <Text key={index} style={styles.appointmentText}>
                {appointment.description} at {appointment.time}
              </Text>
            ))}

      {/* Button to show modal */}
      <Button title="Create Event" onPress={() => setModalVisible(true)} />

      {/* Modal to create an event */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter appointment description"
              value={appointmentDescription}
              onChangeText={setAppointmentDescription}
            />
            <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />

            {/* Time Picker */}
            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="datetime"
              value={selectedTime}
              onConfirm={handleTimeChange}
              onChange={handleTimeChange}
              onCancel={() => setShowTimePicker(false)}
            />

            <TouchableOpacity onPress={handleSaveAppointment} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  appointmentText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
