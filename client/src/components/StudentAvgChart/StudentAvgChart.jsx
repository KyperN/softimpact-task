import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, MenuItem, Select } from '@mui/material';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
export default function StudentAvgChart() {
  const [students, setStudents] = useState([]);
  const [chosenStudent, setChosenStudent] = useState('');
  const [chartData, setChartData] = useState([]);

  const getStudents = async () => {
    await axios
      .get('http://localhost:5000/students')
      .then((res) => setStudents(res.data));
  };

  const handleChosenStudent = (e) => {
    setChosenStudent(e.target.value);
  };

  const validateInput = () => {
    return chosenStudent === '';
  };

  const clearInputs = () => {
    setChosenStudent('');
  };

  const getChartData = async () => {
    setTimeout(clearInputs, 500);
    const { data } = await axios.post(
      'http://localhost:5000/student/report/per-quarter-avg',
      {
        studentId: chosenStudent._id,
      }
    );
    setChartData(data);
    clearInputs();
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div>
      <Select
        onChange={handleChosenStudent}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={chosenStudent}
        label="Student">
        {students.map((student) => {
          return <MenuItem value={student}>{student.name}</MenuItem>;
        })}
      </Select>
      <Button
        disabled={validateInput()}
        onClick={getChartData}
        variant="contained">
        Submit
      </Button>
      <Bar
        options={{}}
        data={{
          labels: chartData.map((elem) => elem._id),
          datasets: [
            {
              label: `Average per Quarter`,
              data: chartData.map((elem) => elem.averageGrade),
              backgroundColor: ['orange'],
            },
          ],
        }}
      />
    </div>
  );
}