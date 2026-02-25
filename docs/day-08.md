# Day 08 - Search, filters, pagination

## Summary
- Added debounced search and filters for projects and tasks.
- Persisted filter state in URL query params for shareable links.
- Added pagination to the projects list to keep large lists smooth.

## Features
- Projects search and status filter with query params: q, status, page
- Tasks search and status filter with query params: tq, tstatus
- Debounced search prevents rapid refetching or UI churn

## How to test
- Navigate to /projects and try search + status filter
- Share a URL like /projects?q=alpha&status=In%20progress&page=1
- Open a project and try /projects/alpha?tq=risk&tstatus=doing
- Verify pagination controls on the projects list
