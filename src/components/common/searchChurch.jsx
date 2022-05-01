import React, { Component } from "react";
import Input from "./input";
import { getChurchesByName } from "../../services/churchService";

class SearchChurch extends Component {
  state = {
    churches: [],
    erros: {},
    searchChurchInput: "",
  };

  handleChange = async ({ currentTarget: input }) => {
    this.setState({ searchChurchInput: input.value });

    let { data: churches } = await getChurchesByName(input.value);

    churches = churches.results;

    if (input.value === "") churches = [];

    if (input.value.length > 0 && churches.length === 0)
      churches = [
        {
          id: 0,
          global_title: "No existe esta iglesia",
        },
      ];

    this.setState({ churches });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.hide && this.props === nextProps) return false;
    else return true;
  }

  componentDidUpdate() {
    if (this.props.hide) this.setState({ searchChurchInput: this.props.value });
  }

  render() {
    const { onSelect, onFocus, onBlur, hide, label = "" } = this.props;
    const { churches } = this.state;

    return (
      <div>
        <Input
          type="text"
          id="searchChurchId"
          name="query"
          className="form-control form-control-sm"
          placeholder="Buscar iglesia..."
          autoComplete="Off"
          onChange={this.handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={this.state.searchChurchInput}
          label={label}
        />

        {churches && !hide && (
          <div
            className="list-group col-11 shadow-lg bg-white position-absolute p-0"
            style={{ marginTop: "-15px", zIndex: "999", maxWidth: "500px" }}
          >
            {churches.map((church) => (
              <button
                key={church.id}
                onClick={() => onSelect(church)}
                className="list-group-item list-group-item-action w-100"
              >
                <span className="d-block">{church.global_title}</span>
                <span
                  className="text-info mb-0"
                  style={{ fontSize: ".9em" }}
                >
                  {church.shepherd && (
                    <em>
                      {"Pastor(a): " +
                        church.shepherd.first_name +
                        " " +
                        church.shepherd.last_name}
                    </em>
                  )}
                </span>

              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SearchChurch;
