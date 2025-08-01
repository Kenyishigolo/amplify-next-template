"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {Authenticator} from '@aws-amplify/ui-react'

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function deleteTodo(id: string){
    client.models.Todo.delete({id});
  }

  return (
    
    <Authenticator>
      {({signOut,user}) => (
      <main>
      <h1>Gestor de Proyectos - Tareas</h1>
      <button onClick={createTodo}>añadir tarea</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}
            onClick={()=>deleteTodo(todo.id)}
          >{todo.content}</li>
        ))}
      </ul>
      <button
        onClick={signOut}
      >
        Cerrar sesión
      </button>
      <div>
        El aplicativo funciona correctamente.
        <br />
        <a>
          Gestor de proyectos - Tareas
        </a>
      </div>
      </main>
      )}
    </Authenticator>
      
    
  );
}
