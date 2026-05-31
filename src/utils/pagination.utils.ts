export const getPagination = (
  count: number,
  perPage: number,
  currPage: number,
) => {
  const total_count = count;
  const total_pages = Math.ceil(total_count / perPage);
  const current_page = currPage;
  const next_page = currPage < total_pages ? currPage + 1 : null;
  const prev_page = currPage === 1 ? null : currPage - 1;
};
