import React, { useEffect, useState } from 'react'
import { shop } from '../utils/route';
import { get } from '../helpers/helper';
import { useRouter } from 'next/router';

const useSearch = () => {
  let router = useRouter()
  let [searchResult, setSearchResult] = useState([]);
  let [attributes, setAttributes] = useState({});
  let [allFilter, setAllFilter] = useState({});
  const {query} = router;
  const [page, setPage] = useState(0);
  let fetchCategoryAttributes = async () => {
    let attributesData = {}
    let categoriesData = []
    if (
      localStorage.getItem("categories") == null ||
      localStorage.getItem("attributes") == null
    ) {
      let { data: categories } = await get(shop.FILTERCATEGORY);
      let { data: attributes } = await get(shop.ATTRIBUTE);
      console.log(attributes)
      console.log(categories)
      localStorage.setItem(
        "categories",
        JSON.stringify(categories.data) ?? []
      );
      localStorage.setItem("attributes", JSON.stringify(attributes) ?? []);
      attributesData = attributes ?? {};
      categoriesData = categories?.data ?? [];

    } else {
      let attributesLocalData = JSON.parse(localStorage.getItem("attributes")) ?? {}
      let categoriesLocalData = JSON.parse(localStorage.getItem("categories")) ?? []
      attributesData = attributesLocalData;
      categoriesData = categoriesLocalData;
    }
    console.log(attributesData)
    console.log(categoriesData)
    setAttributes({
      ...attributes, categories: categoriesData,
      ...attributesData,
     
    })
  };
  useEffect(() => {
    fetchCategoryAttributes();
  }, [])
  useEffect(() => {
    setPage(query?.page ? query.page - 1 : 0)
  }, [query?.page]);
  const applyFilter = async (e, filterName = '/shop') => {
    e.preventDefault();
    let { name, value, checked, change, type } = e.target;
    console.log('filterName',filterName);
    let values = [];
    if (type == 'checkbox') {
      if (checked) {
        values = allFilter[name] ? [...allFilter[name].split(","), value] : [value];
      } else {
        values = allFilter[name] ? allFilter[name].split(",").filter((v) => v != value) : [];
      }
    } else {
      if (allFilter[name]) {
        values = value
      } else {
        values = value
      }
    }
    let filterQuery = {
      ...allFilter,
      [name]: values,
    };
    setAllFilter(filterQuery);

    if (!query?.page){
      pushToUrl(filterName, null, filterQuery)
    }
    pushToUrl(filterName, null, {...filterQuery, page: 1})
  }

  let pushToUrl = (url = '/shop', param = null, query = null) => {
    router.push(
      url + (param ? "/" + param : "") +
      "?" + new URLSearchParams(query).toString()
    );
  }
  useEffect(() => {
    let { query } = router;

    setAllFilter({ ...query })
  }, [router?.query])

  const changePagination = (page, pathName = '/shop') => {
    console.log(page)
    let query = {
      ...allFilter,
      page: page,
    };
    setAllFilter(query);
    pushToUrl(pathName, null, query)
  }
  return {
    attributes,
    setAttributes,
    searchResult,
    setSearchResult,
    applyFilter, changePagination,page
  }
}

export default useSearch