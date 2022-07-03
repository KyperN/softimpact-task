const Grade = require('../schemes/Grade');
const mongoose = require('mongoose');
const getYears = async (req, res) => {
  try {
    const data = await Grade.aggregate([
      {
        $group: {
          _id: { year: '$year', quarter: '$quarter' },
          year: { $max: '$year' },
          quarter: { $max: '$quarter' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).send(data);
    console.log(data);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

const getLessonQuarterAvg = async (req, res) => {
  const { lesson, year } = req.query;
  try {
    const data = await Grade.aggregate([
      {
        $match: {
          lesson: lesson,
          year: year,
        },
      },
      {
        $group: {
          _id: '$quarter',
          averageGrade: { $avg: '$grade' },
        },
      },
    ]);
    console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
  }
};

const getStudentQuarterAvg = async (req, res) => {
  const studentId = req.query.studentId;
  try {
    const data = await Grade.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: { $concat: ['$year', '-', '$quarter'] },
          year: { $max: '$year' },
          quarter: { $max: '$quarter' },
          averageGrade: { $avg: '$grade' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
  }
};

const getAvgPerQuarterAndYear = async (req, res) => {
  try {
    const data = await Grade.aggregate([
      {
        $match: {
          year: req.body.year,
          quarter: req.body.quarter,
        },
      },
      {
        $group: {
          _id: '$lesson',
          averageGrade: { $avg: '$grade' },
        },
      },
    ]);
    res.status(200).send(data);
  } catch (err) {}
};

module.exports = {
  getYears: getYears,
  getLessonQuarterAvg: getLessonQuarterAvg,
  getStudentQuarterAvg: getStudentQuarterAvg,
};