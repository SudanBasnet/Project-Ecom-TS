export const getPagination = (
  count: number,
  perPage: number,
  currPage: number,
) => {
  const total_pages: number = Math.ceil(count / perPage);

  return {
    total_pages,
    total_count: count,
    current_page: currPage,
    next_page: currPage < total_pages ? currPage + 1 : null,
    prev_page: currPage === 1 ? null : currPage - 1,
  };
};
