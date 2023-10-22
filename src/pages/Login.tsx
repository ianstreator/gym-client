import { useState, useEffect, FormEvent } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast, ToastContentProps } from "react-toastify";
import { ENV_API_URL } from "../constants";

function Login() {
  const [form, setForm] = useState<{ [input: string]: string }>({
    email: "",
    password: "",
  });
  const location = useLocation();
  // const navigate = useNavigate();
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    };

    const baseURL = ENV_API_URL;
    const resPromise: Promise<string> = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${baseURL}/auth/login`, options);
        const { message } = (await res.json()) as { user:{}, message: string };
        console.log(res);
        if (res.status === 200) {
          setTimeout(() => {
            resolve(message);
            // navigate(`/user/${x}`);
          }, 2000);
        } else {
          console.log(message);
          reject(message);
        }
      } catch (error) {
        reject("There was an issue on our end");
      }
    });

    toast.promise(resPromise, {
      pending: "We are processing your request.",
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

  const onFormChangeHandler = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((curr) => ({ ...curr, [name]: value }));
  };

  useEffect(() => {}, [form]);

  return (
    <div className="h-full flex flex-col">
      <nav className="mb-4 flex items-center justify-around">
        <Link to="/register" className="opacity-60 underline">
          Register
        </Link>
        <p className="capitalize">{location.pathname.replace("/", "")}</p>
      </nav>
      <form
        action="submit"
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col relative h-full"
      >
        {Object.keys(form).map((input, i) => (
          <div key={i} className="mb-4">
            <label htmlFor={input} className="capitalize">
              {input}
            </label>
            <input
              className="bg-black/25 p-1 text-lg w-full"
              type={input === "password" ? "password" : "text"}
              value={form[input]}
              name={input}
              id={input}
              onChange={(e) => onFormChangeHandler(e)}
            />
          </div>
        ))}
        <button type="submit" className="btn-style w-full mt-auto">
          login
        </button>
      </form>
    </div>
  );
}

export default Login;
