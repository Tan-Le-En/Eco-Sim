/**
 * ECO//SIM — Per-page meta tags (Editorial Field Study v12)
 * Sets title, meta description, and Open Graph tags per route. Called by each
 * page component in a useEffect. Canonical values for the whole site:
 */
import { useEffect } from "react";

export interface MetaProps {
  title: string;
  description: string;
}

export function setMeta({ title, description }: MetaProps) {
  document.title = title;
  const setOrCreate = (
    selector: string,
    attr: string,
    attrValue: string,
    content: string
  ) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setOrCreate('meta[name="description"]', "name", "description", description);
  setOrCreate('meta[property="og:title"]', "property", "og:title", title);
  setOrCreate(
    'meta[property="og:description"]',
    "property",
    "og:description",
    description
  );
  setOrCreate('meta[property="og:type"]', "property", "og:type", "website");
  setOrCreate(
    'meta[property="og:url"]',
    "property",
    "og:url",
    window.location.origin + window.location.pathname
  );
  setOrCreate(
    'meta[property="og:site_name"]',
    "property",
    "og:site_name",
    "ECO//SIM"
  );
  setOrCreate(
    'meta[property="og:image"]',
    "property",
    "og:image",
    window.location.origin + "/storage/og-image_475a5541.jpg"
  );
  setOrCreate(
    'meta[name="twitter:card"]',
    "name",
    "twitter:card",
    "summary_large_image"
  );
  setOrCreate(
    'meta[name="twitter:title"]',
    "name",
    "twitter:title",
    title
  );
  setOrCreate(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description",
    description
  );
  setOrCreate(
    'meta[name="twitter:image"]',
    "name",
    "twitter:image",
    window.location.origin + "/storage/og-image_475a5541.jpg"
  );
}

export default function PageMeta(props: MetaProps) {
  useEffect(() => {
    setMeta(props);
  }, [props.title, props.description]);
  return null;
}
