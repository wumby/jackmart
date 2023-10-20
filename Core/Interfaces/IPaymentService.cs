using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace Core.Interfaces
{
    public interface IPaymentService
    {
    
        Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId);
    }
}