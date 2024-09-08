import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Dashbaord() {
  return (
    <>
      <h1>Protected PAge</h1>
      <UserButton />
    </>
  );
}
