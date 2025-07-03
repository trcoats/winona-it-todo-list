using Microsoft.AspNetCore.Mvc;
using ToDoList.Models;
using ToDoList.Services;

namespace ToDoList.Controllers;

[ApiController]
[Route("[controller]")]
public class ToDoListController : ControllerBase
{
    private readonly IToDoListService _toDoListService;

    public ToDoListController(IToDoListService toDoListService)
    {
        _toDoListService = toDoListService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetToDoListItems()
    {
        return Ok(await _toDoListService.GetToDoListItems());
    }

    [HttpPost]
    public IActionResult AddToDoListItem([FromBody] ToDoListItem item)
    {
        _toDoListService.AddToDoListItem(item);
        return Ok();
    }
}