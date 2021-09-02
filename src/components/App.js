import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    fetch('http://localhost:4000/questions')
    .then(r => r.json())
    .then(incomingQuestions => {
      setQuestions(incomingQuestions)
    })
  }, [])

  function addQuestion(question) {
    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(question)
    })
    .then(r => r.json())
    .then(question => setQuestions([...questions, question]))
  }

  function deleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json())
    .then(() => {
      setQuestions(questions.filter(question => question.id !== id))
    })
  }

  function updateQuestion(id, correctIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({correctIndex})
    })
    .then(r => r.json())
    .then(updated => {
      setQuestions(questions.map(question => {
        if (updated.id === question.id) {
          return { ...updated, correctIndex }
        }
        return question;
      }))
    })
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm addQuestion={addQuestion}/> : <QuestionList questions={questions} deleteQuestion={deleteQuestion} updateQuestion={updateQuestion}/>}
    </main>
  );
}

export default App;
