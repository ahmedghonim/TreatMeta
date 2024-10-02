
import { fetchData } from "./fetchData";
export async function renameVariables(
  prepost: boolean,
  groups: number,
  category: number,
  vars: Array<string>
) {
  try {
    const { data } = await fetchData<any>("/Rename_variables", {
      method: "POST",
      body: {
        var_names: JSON.stringify(vars),
        current_groups: groups,
        current_prepost: prepost,
        category: category
      },
    });
    return data;
  } catch (e) {
    console.log(e);
  }
}