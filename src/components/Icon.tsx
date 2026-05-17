import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

export const Icons = {
  search: (p: P = {}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>,
  filter: (p: P = {}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 5h14M5.5 10h9M8 15h4"/></svg>,
  plus:   (p: P = {}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M10 4v12M4 10h12"/></svg>,
  heart:  (p: P = {}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M10 16.5s-6-3.7-6-8a3.5 3.5 0 0 1 6-2.45A3.5 3.5 0 0 1 16 8.5c0 4.3-6 8-6 8z"/></svg>,
  heartF: (p: P = {}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 17s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 17 8c0 4.8-7 9-7 9z"/></svg>,
  clock:  (p: P = {}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="8" cy="8" r="6.2"/><path d="M8 4.5V8l2.4 1.5"/></svg>,
  flame:  (p: P = {}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" {...p}><path d="M8 1.5c2 2 3.5 3.5 3.5 6a3.5 3.5 0 1 1-7 0c0-1.4.6-2.3 1.5-3 0 1.2.5 1.6 1 1.6 0-1.7.4-3.2 1-4.6z"/></svg>,
  home:   (p: P = {}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M3 10 11 3l8 7v8a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1z"/></svg>,
  book:   (p: P = {}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H17v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 1 5.5 18H17"/></svg>,
  user:   (p: P = {}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="11" cy="8" r="3.6"/><path d="M4 19c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8"/></svg>,
  back:   (p: P = {}) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 4-6 5 6 5"/></svg>,
  share:  (p: P = {}) => <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 3v9M6.5 6 10 3l3.5 3M5 12v3.5A1.5 1.5 0 0 0 6.5 17h7a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>,
  doc:    (p: P = {}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...p}><path d="M5 3h8l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13 3v4h4M7 11h8M7 14h8M7 17h5"/></svg>,
  upload: (p: P = {}) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M11 14V4M7 8l4-4 4 4M4 16v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"/></svg>,
  trash:  (p: P = {}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...p}><path d="M3 5h10M6 5V3.5A.5.5 0 0 1 6.5 3h3a.5.5 0 0 1 .5.5V5M5 5l.7 8a1 1 0 0 0 1 .9h2.6a1 1 0 0 0 1-.9L11 5"/></svg>,
  check:  (p: P = {}) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m2.5 6.5 2.5 2.5 4.5-5.5"/></svg>,
  add:    (p: P = {}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M8 4v8M4 8h8"/></svg>,
  x:      (p: P = {}) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M4 4l8 8M12 4l-8 8"/></svg>,
}
