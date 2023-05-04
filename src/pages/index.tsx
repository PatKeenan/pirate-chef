import Head from "next/head";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { NextPage } from "next";

import clsx from "clsx";
import { type FormSchema, formSchema } from "~/utils/types";
import React from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pirate Chef</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/*  <AuthShowcase /> */}
        <div>
          <h1 className="mb-3 text-center text-2xl font-medium text-white/50">
            The Pirate Chef
          </h1>

          <Prompt />
        </div>
      </main>
    </>
  );
};

export default Home;

const Prompt: React.FC = () => {
  const [recommendation, setRecommendation] = React.useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = React.useState(false);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const d = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json() as Promise<{ text: string }>)
      .catch((err) => console.log(err));
    if (d && d.text) setRecommendation(d.text.replaceAll(`"`, "").trim());
    setLoading(false);
    setValue("meal", "");
    return;
  });

  const styles = {
    container: "flex flex-col space-y-2",
    input:
      "rounded-md border p-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400",
    label: "font-medium text-gray-800",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="min-h-[400px] w-[450px] flex-1 rounded-lg bg-white p-10 shadow">
        {recommendation && (
          <div className="flex h-full flex-col">
            <p className="my-4 h-full whitespace-pre-wrap text-gray-700">
              {recommendation}
            </p>
            <div>
              <button
                className="mt-auto w-full rounded-md border border-violet-800 bg-white px-4 py-2 text-center text-violet-600"
                onClick={() => setRecommendation(undefined)}
              >
                Ask Again
              </button>
            </div>
          </div>
        )}
        {!recommendation ? (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <form onSubmit={onSubmit} className="space-y-6 ">
            <div className={styles.container}>
              <label htmlFor="meal" className={styles.label}>
                Choose Your Meal
              </label>
              <select
                className={clsx(
                  styles.input,
                  errors && errors["meal"] && "border-red-500"
                )}
                {...register("meal")}
              >
                <option value="Lose Weight">Breakfast</option>
                <option value="Eat Healthier">Lunch</option>
                <option value="Gain Weight">Dinner</option>
              </select>
            </div>
            <div className={styles.container}>
              <label htmlFor="nutritional-goal" className={styles.label}>
                Select Your Nutritional Goal
              </label>
              <select
                className={clsx(
                  styles.input,
                  errors && errors["nutritional-goal"] && "border-red-500"
                )}
                {...register("nutritional-goal")}
              >
                <option value="Lose Weight">Lose Weight</option>
                <option value="Eat Healthier">Eat Healthier</option>
                <option value="Gain Weight">Gain Weight</option>
              </select>
            </div>

            <div className={styles.container}>
              <label htmlFor="favorite-foods" className={styles.label}>
                List Your Favorite foods
              </label>
              <input
                type="text"
                placeholder="Spinach, Broccoli, Pasta..."
                id="favorite-foods"
                autoComplete="off"
                className={clsx(
                  styles.input,
                  errors && errors["favorite-foods"] && "border-red-500"
                )}
                {...register("favorite-foods")}
              />
            </div>

            <button className="w-full rounded-md border border-violet-800 bg-violet-600 px-4 py-2 text-center text-white">
              {loading ? "Searching the Galley..." : "Generate Recommendation"}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};