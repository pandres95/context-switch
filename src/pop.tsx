import { useState, useEffect } from "react";
import { reader } from "./plugins";
import PopList from "./components/PopList";

export default function PopCommand() {
  const [context, setContext] = useState<string | null>(null);

  useEffect(() => {
    reader.getCurrentContext().then(setContext);
  }, []);

  return <PopList context={context} />;
}
