import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Form = ({ formData, forNewMovie = true }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: formData.title,
    plot: formData.plot,
  });
  const [message, setMessage] = useState([]);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forNewMovie) {
      postData(form);
    } else {
      putData(form);
    }
  };

  const putData = async (form) => {
    setMessage([]);
    const { id } = router.query;
    try {
      const res = await fetch(`/api/movie/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMessage((oldmessage) => [
            ...oldmessage,
            { message: error.message },
          ]);
        }
      } else {
        setMessage([]);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (form) => {
    try {
      console.log(form);
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMessage((oldmessage) => [
            ...oldmessage,
            { message: error.message },
          ]);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control my-2"
        placeholder="title"
        autoComplete="off"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        type="text"
        className="form-control my-2"
        placeholder="plot"
        autoComplete="off"
        name="plot"
        value={form.plot}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-100" type="submit">
        {forNewMovie ? "Agregar" : "Editar"}
      </button>
      <Link href="/">
        <p className="btn btn-warning w-100 my-2">Volver...</p>
      </Link>

      {message.map(({ message }) => (
        <p key={message}>{message}</p>
      ))}
    </form>
  );
};

export default Form;
