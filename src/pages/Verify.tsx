import { useState, useEffect, FormEvent, RefObject } from "react";
import React from "react";
import { toast, ToastContentProps } from "react-toastify";
import { ENV_API_URL } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

function Verify() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") as string;
  const code = searchParams.get("code") as string;
  const navigate = useNavigate();
  useEffect(() => {
    if (!email) navigate("/register");
  }, []);

  const [inputs, setInputs] = useState<string[]>(
    (code && [...code]) || ["", "", "", "", "", ""]
  );
  const inputRefs: RefObject<HTMLInputElement>[] = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = inputs.join("");
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    };

    const baseURL = ENV_API_URL;
    const resPromise: Promise<string> = new Promise(async (resolve, reject) => {
      const res = await fetch(`${baseURL}/auth/verify`, options);
      const { message } = (await res.json()) as { message: string };
      console.log(res.status, message);
      if (res.status === 200) {
        setTimeout(() => {
          resolve(message);
        }, 2000);
      } else {
        reject(message);
      }
      return message;
    });

    toast.promise(resPromise, {
      pending: "Attempting to verify your identity.",
      success: {
        render({ data }: ToastContentProps<string>) {
          return data;
        },
      },
      error: {
        render({ data }: ToastContentProps<string>) {
          return data;
        },
      },
    });
  };
  const acceptableChars = /([a-z0-9])/i;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { value } = e.target;
    if (!acceptableChars.test(value) && value) {
      return;
    }
    const newInputs: string[] = [...inputs];
    newInputs[i] = value.toUpperCase();
    setInputs([...newInputs]);
    if (value && i < inputRefs.length - 1) {
      inputRefs[i + 1].current?.select();
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    const value = e.key;
    if (!acceptableChars.test(value) && value) {
      inputRefs[i].current?.select();
      return;
    }
    if (i === inputs.length - 1) inputRefs[i].current?.select();

    if (inputs[i] === "" && value === "Backspace" && i !== 0) {
      inputRefs[i - 1].current?.select();
    }
  };

  //   useEffect(() => {
  //     console.log(inputs);
  //   }, [inputs]);

  return (
    <form
      action="submit"
      onSubmit={(e) => onSubmit(e)}
      className="flex flex-col relative h-full"
    >
      <div className="flex flex-col items-center w-full">
        <code className="mb-10">Enter the code sent to</code>
        <p className="font-bold text-lg">{email}</p>
      </div>
      <div className="flex h-full justify-center items-center">
        {inputs.map((input, i) => (
          <input
            type="text"
            key={i}
            value={input}
            maxLength={1}
            onChange={(e) => handleChange(e, i)}
            onKeyUp={(e) => handleKeyUp(e, i)}
            ref={inputRefs[i]}
            className="capitalize text-center w-8 h-12 mx-1 rounded-md bg-black/25"
          />
        ))}
      </div>

      <button type="submit" className="btn-style w-full mt-auto">
        verify
      </button>
    </form>
  );
}

export default Verify;